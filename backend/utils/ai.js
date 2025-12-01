const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateCourseContent = async (topic) => {
  try {
    let modelName = "gemini-1.5-pro";
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = `Create a comprehensive course outline for the topic: "${topic}". 
      Include detailed notes and explanations for each lesson.
      Return the response in valid JSON format with the following structure:
      {
        "title": "Course Title",
        "description": "Detailed course description (2-3 sentences)",
        "content": [
          {
            "title": "Module Title",
            "description": "Module description",
            "lessons": [
              {
                "title": "Lesson Title",
                "content": "Detailed lesson notes and explanations (at least 3-4 paragraphs with key concepts, examples, and explanations)"
              }
            ]
          }
        ]
      }
      Create at least 3 modules with 3-4 lessons each. Make the content educational and comprehensive.
      Do not include markdown formatting like \`\`\`json. Just the raw JSON string.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonString);
    } catch (err) {
      console.log("Trying fallback model...", err.message);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Create a detailed course on "${topic}". Return ONLY valid JSON:
      {"title": "Course Title", "description": "Course description", "content": [{"title": "Module 1", "description": "Module description", "lessons": [{"title": "Lesson 1", "content": "Detailed lesson content with explanations"}]}]}
      Include at least 3 modules with detailed lesson content.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonString);
    }
  } catch (error) {
    console.error("Error generating course content:", error);
    return {
      title: `Complete Guide to ${topic}`,
      description: `A comprehensive course covering all aspects of ${topic}, from fundamentals to advanced concepts.`,
      content: [
        {
          title: "Introduction and Fundamentals",
          description: "Getting started with the core concepts",
          lessons: [
            {
              title: "What is " + topic + "?",
              content: `${topic} is a fundamental concept that plays a crucial role in modern applications. Understanding ${topic} requires knowledge of its core principles and how they apply in real-world scenarios.\n\nKey concepts include the basic definitions, historical context, and why ${topic} matters in today's world. This lesson will provide you with a solid foundation to build upon.\n\nBy the end of this lesson, you'll understand the fundamental principles and be ready to explore more advanced topics.`
            },
            {
              title: "Core Principles",
              content: `The core principles of ${topic} form the foundation of everything you'll learn. These principles are universal and apply across different contexts and applications.\n\nWe'll explore each principle in detail, with practical examples and use cases. Understanding these principles is essential for mastering ${topic}.\n\nPractice exercises will help reinforce your understanding and prepare you for more complex concepts.`
            },
            {
              title: "Getting Started",
              content: `Now that you understand the basics, let's dive into practical applications. This lesson covers the essential tools, techniques, and best practices you'll need.\n\nWe'll walk through step-by-step examples, starting with simple scenarios and gradually increasing complexity. Each example builds on previous knowledge.\n\nBy the end of this lesson, you'll be able to apply ${topic} concepts to solve real problems.`
            }
          ]
        },
        {
          title: "Intermediate Concepts",
          description: "Building on the fundamentals",
          lessons: [
            {
              title: "Advanced Techniques",
              content: `Advanced techniques in ${topic} allow you to solve more complex problems efficiently. These techniques build upon the fundamentals you've already learned.\n\nWe'll explore optimization strategies, common patterns, and industry best practices. Real-world case studies demonstrate how professionals apply these techniques.\n\nMastering these techniques will significantly improve your proficiency in ${topic}.`
            },
            {
              title: "Common Patterns and Practices",
              content: `Design patterns and best practices are essential for writing maintainable and efficient solutions. This lesson covers the most important patterns in ${topic}.\n\nYou'll learn when to apply each pattern, common pitfalls to avoid, and how to adapt patterns to your specific needs. Examples from real projects illustrate these concepts.\n\nUnderstanding these patterns will make you a more effective practitioner of ${topic}.`
            },
            {
              title: "Problem-Solving Strategies",
              content: `Effective problem-solving is a critical skill in ${topic}. This lesson teaches you systematic approaches to tackle complex challenges.\n\nWe'll cover debugging techniques, performance optimization, and how to break down large problems into manageable pieces. Practice problems help you apply these strategies.\n\nDeveloping strong problem-solving skills will serve you throughout your journey with ${topic}.`
            }
          ]
        },
        {
          title: "Advanced Topics and Real-World Applications",
          description: "Expert-level concepts and practical projects",
          lessons: [
            {
              title: "Industry Applications",
              content: `See how ${topic} is applied in real-world industry scenarios. This lesson features case studies from leading companies and projects.\n\nYou'll learn about scalability considerations, production best practices, and how to handle edge cases. Industry experts share their insights and experiences.\n\nUnderstanding real-world applications prepares you for professional work in ${topic}.`
            },
            {
              title: "Advanced Projects",
              content: `Put your knowledge into practice with comprehensive projects. These projects simulate real-world challenges and require you to apply everything you've learned.\n\nEach project includes detailed requirements, suggested approaches, and evaluation criteria. You'll work through the entire development lifecycle.\n\nCompleting these projects demonstrates your mastery of ${topic} and builds your portfolio.`
            },
            {
              title: "Future Trends and Continuing Education",
              content: `Stay ahead of the curve by understanding emerging trends in ${topic}. This lesson covers the latest developments and future directions.\n\nWe'll discuss new technologies, evolving best practices, and how to continue learning beyond this course. Resources for further study are provided.\n\nLifelong learning is essential in the rapidly evolving field of ${topic}.`
            }
          ]
        }
      ]
    };
  }
};

const generateQuiz = async (topic, courseContent = null) => {
  try {
    let modelName = "gemini-1.5-pro";
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      let contextInfo = courseContent ? `Based on this course content: ${JSON.stringify(courseContent).substring(0, 500)}` : '';
      
      const prompt = `Create a comprehensive quiz for the topic: "${topic}". ${contextInfo}
      Create 10 multiple choice questions that test understanding of key concepts.
      Return the response in valid JSON format with the following structure:
      {
        "title": "Quiz Title",
        "questions": [
          {
            "question": "Detailed question text",
            "options": ["Option A with full text", "Option B with full text", "Option C with full text", "Option D with full text"],
            "correctAnswer": "Option A with full text (must match exactly)"
          }
        ]
      }
      Make questions challenging but fair. Cover different difficulty levels.
      Do not include markdown formatting like \`\`\`json. Just the raw JSON string.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonString);
    } catch (err) {
      console.log("Trying fallback model for quiz...", err.message);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Create a quiz for "${topic}" with 10 questions. Return ONLY valid JSON: {"title": "Quiz", "questions": [{"question": "Question text", "options": ["A", "B", "C", "D"], "correctAnswer": "A"}]}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonString);
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    return {
      title: `${topic} Assessment Quiz`,
      questions: [
        {
          question: `What is the primary purpose of ${topic}?`,
          options: [
            "To solve complex problems efficiently",
            "To make tasks more difficult",
            "To replace human thinking",
            "None of the above"
          ],
          correctAnswer: "To solve complex problems efficiently"
        },
        {
          question: `Which of the following is a fundamental concept in ${topic}?`,
          options: [
            "Core principles and best practices",
            "Random guessing",
            "Ignoring documentation",
            "Avoiding planning"
          ],
          correctAnswer: "Core principles and best practices"
        },
        {
          question: `What is the best approach when learning ${topic}?`,
          options: [
            "Start with fundamentals and build gradually",
            "Skip the basics and go straight to advanced topics",
            "Memorize without understanding",
            "Avoid practice exercises"
          ],
          correctAnswer: "Start with fundamentals and build gradually"
        },
        {
          question: `In ${topic}, what role do best practices play?`,
          options: [
            "They ensure efficient and maintainable solutions",
            "They make work more complicated",
            "They are optional and can be ignored",
            "They only apply to beginners"
          ],
          correctAnswer: "They ensure efficient and maintainable solutions"
        },
        {
          question: `How should you approach problem-solving in ${topic}?`,
          options: [
            "Break down complex problems into smaller parts",
            "Try to solve everything at once",
            "Avoid planning and jump straight to implementation",
            "Give up when faced with challenges"
          ],
          correctAnswer: "Break down complex problems into smaller parts"
        },
        {
          question: `What is an important skill for mastering ${topic}?`,
          options: [
            "Continuous learning and practice",
            "Memorizing syntax without understanding",
            "Avoiding real-world applications",
            "Working in isolation without seeking help"
          ],
          correctAnswer: "Continuous learning and practice"
        },
        {
          question: `Which statement about ${topic} is most accurate?`,
          options: [
            "It requires both theoretical knowledge and practical application",
            "Theory is unnecessary, only practice matters",
            "Practice is unnecessary, only theory matters",
            "Neither theory nor practice is important"
          ],
          correctAnswer: "It requires both theoretical knowledge and practical application"
        },
        {
          question: `What should you do when encountering errors in ${topic}?`,
          options: [
            "Debug systematically and learn from mistakes",
            "Ignore them and hope they go away",
            "Start over from scratch immediately",
            "Blame the tools and give up"
          ],
          correctAnswer: "Debug systematically and learn from mistakes"
        },
        {
          question: `How does ${topic} apply to real-world scenarios?`,
          options: [
            "It solves practical problems across various industries",
            "It has no real-world applications",
            "It only works in theoretical contexts",
            "It's only useful for academic purposes"
          ],
          correctAnswer: "It solves practical problems across various industries"
        },
        {
          question: `What is the key to advancing your skills in ${topic}?`,
          options: [
            "Regular practice, projects, and staying updated with trends",
            "Reading documentation once is enough",
            "Avoiding challenging projects",
            "Learning in isolation without community support"
          ],
          correctAnswer: "Regular practice, projects, and staying updated with trends"
        }
      ]
    };
  }
};

module.exports = { generateCourseContent, generateQuiz };
