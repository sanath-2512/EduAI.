const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateCourseContent = async (topic) => {
  try {
    console.log(`🚀 Generating expert course on "${topic}" using Groq...`);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert educator, instructional designer, and subject-matter expert.
          
Create a complete course on any topic following this EXACT structure. Do NOT skip anything:

1. **Beginner-Friendly Explanation**
   - Explain the topic like the student is a complete beginner
   - Use super simple language
   - Use real-life examples
   - Remove all jargon unless explained

2. **Deep Theory & Concepts**
   - Explain every concept step-by-step
   - Use bullet points, diagrams (text-based), flowcharts, analogies
   - Include why each concept matters and where it is used

3. **Practical Examples**
   - Give 5–10 real-world examples
   - Solve each example in detail
   - Show mistakes beginners make and correct them

4. **Hands-On Activities / Exercises**
   - Create 10 exercises from easy → medium → hard
   - Provide solutions separately

5. **Case Study / Real Use-Case**
   - Give a real-world situation where the topic is applied
   - Break the solution into steps

6. **Quizzes**
   - Create a chapter-wise quiz
   - 10 MCQs per chapter with correct answers and explanations

7. **Project / Assignment**
   - Give at least one mini-project and one final project
   - Provide sample solution and extra improvement ideas

8. **Revision Notes**
   - Summarize the whole course in less than 2 pages
   - Use bullet points, formulas, shortcuts, tips

9. **Final Assessment**
   - Create a 20-question final exam with answers
          
          Output MUST be valid JSON matching this schema exactly:
          {
            "title": "Course Title",
            "description": "Course Description",
            "learningOutcomes": ["Outcome 1", "Outcome 2", "Outcome 3", "Outcome 4"],
  "estimatedDuration": "X hours",
  "estimatedLearningHours": X,
            "modules": [
              {
                "moduleTitle": "Module Title",
                "level": "Beginner|Intermediate|Advanced",
                "moduleOverview": "Overview",
      "estimatedHours": X,
                "lessons": [
                  {
                    "lessonTitle": "Lesson Title",
          "beginnerExplanation": "Simple explanation with real-life examples, no jargon. Minimum 300 words.",
          "deepTheory": "Step-by-step theory with bullet points, analogies, diagrams (text-based), flowcharts. Explain why it matters. Minimum 500 words.",
          "practicalExamples": [
            {
              "title": "Example 1 Title",
              "description": "Detailed example with step-by-step solution",
              "commonMistakes": "Common mistakes beginners make",
              "correction": "How to correct them"
            }
          ],
          "handsOnExercises": [
            {
              "exercise": "Exercise question/problem",
              "difficulty": "Easy|Medium|Hard",
              "solution": "Detailed solution"
            }
          ],
          "caseStudy": {
            "title": "Case Study Title",
            "scenario": "Real-world situation description",
            "steps": ["Step 1", "Step 2", "Step 3"],
            "outcome": "Expected outcome"
          },
          "chapterQuiz": {
            "questions": [
              {
                "question": "Question text?",
                "options": ["A", "B", "C", "D"],
                "correctAnswer": "Correct option text",
                "explanation": "Why this answer is correct"
              }
            ]
          },
          "estimatedHours": X
        }
      ]
    }
  ],
  "projects": {
    "miniProject": {
      "title": "Mini Project Title",
      "description": "Project description",
      "requirements": ["Requirement 1", "Requirement 2"],
      "sampleSolution": "Sample solution description",
      "improvementIdeas": ["Idea 1", "Idea 2"]
    },
    "finalProject": {
      "title": "Final Project Title",
      "description": "Project description",
      "requirements": ["Requirement 1", "Requirement 2"],
      "sampleSolution": "Sample solution description",
      "improvementIdeas": ["Idea 1", "Idea 2"]
    }
  },
  "revisionNotes": "Complete revision notes summarizing the course in less than 2 pages. Use bullet points, formulas, shortcuts, tips.",
  "finalAssessment": {
    "questions": [
      {
        "question": "Question text?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "Correct option text",
        "explanation": "Detailed explanation"
      }
    ]
  },
  "resources": {
    "youtubePlaylists": [
      {
        "title": "Playlist Title",
        "playlistId": "PLxxxxx",
        "description": "Why this playlist is helpful for learning this topic"
      }
    ],
    "recommendedBooks": [
      {
        "title": "Book Title",
        "author": "Author Name",
        "description": "Why this book is essential for mastering this topic",
        "link": "Amazon/Goodreads link if available"
      }
    ],
    "articles": [
      {
        "title": "Article Title",
        "url": "https://example.com/article",
        "description": "What you'll learn from this article"
      }
    ],
    "documentation": [
      {
        "title": "Official Documentation",
        "url": "https://docs.example.com",
        "description": "Official documentation for reference"
      }
    ],
    "tools": [
      {
        "name": "Tool Name",
        "url": "https://tool.example.com",
        "description": "How this tool helps in learning/practicing"
      }
    ],
    "courses": [
      {
        "title": "Course Title",
        "platform": "Platform Name (Coursera, Udemy, etc.)",
        "url": "Course URL",
        "description": "Why this course complements your learning"
      }
    ]
  }
}

IMPORTANT:
- Create 3-4 modules with DIFFERENT structures and themes:
  * Module 1: "Getting Started" - Foundation concepts, basics
  * Module 2: "Core Concepts" - Main principles, building blocks
  * Module 3: "Advanced Techniques" - Deeper dive, complex topics
  * Module 4: "Real-World Applications" - Practical use cases, industry examples
  
- Each module should have 2-4 lessons with VARIED content:
  * Mix of theoretical and practical lessons
  * Some lessons focus on concepts, others on hands-on practice
  * Vary the depth and complexity within each module
  
- Each lesson MUST include all 9 sections but vary the emphasis:
  * Some lessons emphasize examples, others emphasize theory
  * Vary the number of exercises (5-8 per lesson)
  * Vary the number of practical examples (3-5 per lesson)
  
- Make modules visually distinct with different:
  * Module titles that reflect their unique purpose
  * Module overviews that explain the module's specific focus
  * Lesson titles that are creative and engaging
  
- Provide 10 MCQs per lesson/chapter
- Include both mini-project and final project
- Include comprehensive revision notes
- Include 20-question final assessment
- Calculate realistic estimatedHours for each lesson and module
- Total estimatedLearningHours should be the sum of all module hours

- CRITICAL: Make each module feel DIFFERENT and UNIQUE. Avoid repetitive structures.

RESOURCES SECTION (CRITICAL - DO NOT SKIP):
- Include 3-5 YouTube playlists with actual playlist IDs (search for real playlists on YouTube)
- Include 2-4 recommended books with authors and why they're helpful
- Include 5-10 high-quality articles from reputable sources (Medium, Dev.to, official blogs)
- Include official documentation links
- Include 3-5 useful tools/software for practice
- Include 2-3 complementary courses from platforms like Coursera, Udemy, freeCodeCamp
- For each resource, explain WHY it's helpful and HOW it enhances learning
- Make resources diverse - mix beginner and advanced resources
- Ensure all URLs are real and accessible
- Focus on resources that provide practical, hands-on learning experiences`
        },
        {
          role: "user",
          content: `Create a complete course on the topic: **${topic}**.
          
IMPORTANT FOR RESOURCES:
- Research and include REAL YouTube playlist IDs (format: PLxxxxx)
- Include ACTUAL book titles and authors (use popular, well-reviewed books)
- Provide REAL article URLs from reputable sources
- Include official documentation links
- Suggest REAL tools and platforms that exist
- For each resource, explain its value and how it complements the course content

Make the entire course clean, structured, extremely clear, and easy to understand for any student.
          Return ONLY valid JSON. Do not include any conversational text.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 8000,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content received from Groq");
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      console.error('Raw content:', content.substring(0, 500));
      return createDefaultCourse(topic);
    }
    
    // Validate structure
    if (!parsedContent.modules || !Array.isArray(parsedContent.modules) || parsedContent.modules.length === 0) {
      console.error('❌ Invalid course structure - no modules found');
      return createDefaultCourse(topic);
    }
    
    console.log(`✅ Course generated successfully: ${parsedContent.title}`);
    console.log(`📚 Modules: ${parsedContent.modules.length}`);
    parsedContent.modules.forEach((module, idx) => {
      console.log(`  Module ${idx + 1}: ${module.moduleTitle || module.title} - ${module.lessons?.length || 0} lessons`);
    });
    
    return parsedContent;

  } catch (error) {
    console.error("❌ Groq Course Generation Error:", error.message);
    return createDefaultCourse(topic); // Fallback to default if API fails
  }
};

const generateQuiz = async (topic, modules = []) => {
  try {
    console.log(`🎯 Generating comprehensive quiz for "${topic}" using Groq...`);

    // Collect all questions from chapter quizzes and final assessment
    let allQuestions = [];
    
    // Extract questions from modules/lessons
    if (modules && modules.length > 0) {
      modules.forEach((module, mIndex) => {
        if (module.lessons && module.lessons.length > 0) {
          module.lessons.forEach((lesson, lIndex) => {
            if (lesson.chapterQuiz && lesson.chapterQuiz.questions) {
              allQuestions = allQuestions.concat(lesson.chapterQuiz.questions);
            }
          });
        }
      });
    }

    // If we have questions from lessons, use them, otherwise generate new ones
    if (allQuestions.length >= 10) {
      // Use existing questions from course
      return {
        title: `${topic} - Comprehensive Quiz`,
        questions: allQuestions.slice(0, 20) // Limit to 20 questions
      };
    }

    // Generate new quiz if not enough questions from course
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert examiner. Create a challenging, educational quiz.
          
          Structure:
          - 15-20 Questions total
          - Mix of Easy (30%), Medium (50%), Hard (20%)
          - Scenario-based questions preferred over simple definitions
          - Each question must be UNIQUE and different from others
          - Cover different aspects of the topic
          
          Output JSON schema:
          {
            "title": "Quiz Title",
            "questions": [
              {
                "question": "Unique question text? (must be different from all other questions)",
                "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
                "correctAnswer": "The correct option text (must match one option exactly)",
                "explanation": "Detailed explanation of why the answer is correct and others are wrong."
              }
            ]
          }
          
          IMPORTANT: Make sure each question is completely unique and covers different aspects of the topic.`
        },
        {
          role: "user",
          content: `Create a comprehensive 15-20 question quiz for the topic: **${topic}**. 
          
          Ensure:
          - Each question is unique and different
          - Questions cover various aspects of ${topic}
          - Mix of difficulty levels
          - Scenario-based questions where possible`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    const parsedContent = JSON.parse(content);
    
    // Ensure questions are unique
    const uniqueQuestions = [];
    const seenQuestions = new Set();
    
    parsedContent.questions.forEach(q => {
      const questionKey = q.question.toLowerCase().trim();
      if (!seenQuestions.has(questionKey)) {
        seenQuestions.add(questionKey);
        uniqueQuestions.push(q);
      }
    });
    
    parsedContent.questions = uniqueQuestions;
    
    console.log(`✅ Quiz generated successfully: ${parsedContent.title} with ${parsedContent.questions.length} unique questions`);
    return parsedContent;

  } catch (error) {
    console.error("❌ Groq Quiz Generation Error:", error.message);
    return createDefaultQuiz(topic);
  }
};

// --- Fallback Functions (Better content for offline mode) ---

function createDefaultCourse(topic) {
  return {
    title: `Introduction to ${topic}`,
    description: `Learn the fundamentals of ${topic}. Note: This is a basic template course. For full AI-generated content with comprehensive modules, examples, and exercises, please try again when the AI service is available.`,
    learningOutcomes: [
      `Understand the core concepts of ${topic}`,
      `Learn practical applications and use cases`,
      `Build foundational knowledge for advanced topics`,
      `Practice with hands-on examples`
    ],
    estimatedDuration: "2-3 weeks",
    estimatedLearningHours: 15,
    modules: [
      {
        moduleTitle: `Getting Started with ${topic}`,
        level: "Beginner",
        moduleOverview: `This module introduces you to the fundamental concepts of ${topic}. You'll learn what it is, why it matters, and how to get started.`,
        estimatedHours: 3,
        lessons: [
          {
            lessonTitle: `What is ${topic}?`,
            beginnerExplanation: `${topic} is an important concept in its field. Think of it like learning a new skill - you start with the basics and build up from there.\n\nImagine you're learning to cook. ${topic} is like understanding the basic ingredients and cooking techniques before you make complex dishes. You need to know what each component does and how they work together.\n\nIn simple terms, ${topic} helps solve real-world problems by providing a structured approach to handling specific challenges. Whether you're a student, professional, or enthusiast, understanding ${topic} opens up new possibilities.`,
            deepTheory: `## Understanding ${topic} in Depth\n\n${topic} is built on several core principles:\n\n### Key Concepts\n- **Foundation**: The basic building blocks that make ${topic} work\n- **Structure**: How different components are organized\n- **Function**: What ${topic} actually does and accomplishes\n- **Application**: Where and how ${topic} is used in practice\n\n### Why ${topic} Matters\n${topic} is widely used because it provides efficient solutions to common problems. Industries rely on it for improving workflows, increasing productivity, and achieving better results.\n\n### Real-World Impact\nCompanies and individuals use ${topic} daily to:\n1. Streamline processes\n2. Reduce complexity\n3. Improve outcomes\n4. Scale operations`,
            practicalExamples: [
              {
                title: "Basic Example",
                description: `Let's say you want to apply ${topic} to a simple project. You would start by identifying the problem, understanding the requirements, and then implementing a solution step by step.`,
                commonMistakes: `Beginners often try to rush through learning ${topic} without understanding the fundamentals. This leads to confusion later.`,
                correction: `Take time to understand each concept thoroughly before moving to the next. Practice with simple examples first.`
              },
              {
                title: "Practical Application",
                description: `In a real scenario, ${topic} can be applied to everyday tasks. For example, organizing information, solving problems systematically, or automating repetitive work.`,
                commonMistakes: `Trying to use advanced techniques without mastering basics.`,
                correction: `Follow a learning path: basics → intermediate → advanced. Build a strong foundation.`
              }
            ],
            handsOnExercises: [
              {
                exercise: `Research and list 3 real-world applications of ${topic} in your field of interest.`,
                difficulty: "Easy",
                solution: `Look for case studies, articles, or examples online. Document how ${topic} is being used and what problems it solves.`
              },
              {
                exercise: `Identify a simple problem that could be solved using ${topic}. Outline the steps you would take.`,
                difficulty: "Medium",
                solution: `Break down the problem into smaller parts. Map each part to concepts you've learned about ${topic}.`
              }
            ],
            caseStudy: {
              title: `Real-World Use of ${topic}`,
              scenario: `Consider a scenario where a team needs to implement ${topic} to solve a business challenge. They need to improve efficiency and reduce errors.`,
              steps: [
                "Analyze the current situation and identify pain points",
                "Research how ${topic} can address these issues", 
                "Plan the implementation strategy",
                "Execute in phases with testing",
                "Measure results and optimize"
              ],
              outcome: `By applying ${topic} correctly, the team achieves significant improvements in their workflow and productivity.`
            },
            chapterQuiz: {
              questions: [
                {
                  question: `What is the main purpose of ${topic}?`,
                  options: [
                    "To make complex problems manageable",
                    "To replace human thinking",
                    "To create more work",
                    "None of the above"
                  ],
                  correctAnswer: "To make complex problems manageable",
                  explanation: `${topic} is designed to help break down and solve complex challenges in a structured way.`
                },
                {
                  question: `Which is the best approach when learning ${topic}?`,
                  options: [
                    "Jump straight to advanced topics",
                    "Start with fundamentals and build up",
                    "Skip theory and only do practice",
                    "Memorize without understanding"
                  ],
                  correctAnswer: "Start with fundamentals and build up",
                  explanation: "Building a strong foundation is crucial for mastering any topic."
                }
              ]
            },
            estimatedHours: 3
          }
        ]
      },
      {
        moduleTitle: `Practical Applications of ${topic}`,
        level: "Intermediate",
        moduleOverview: `Learn how to apply ${topic} in real-world scenarios with hands-on examples and projects.`,
        estimatedHours: 4,
        lessons: [
          {
            lessonTitle: `Applying ${topic} in Practice`,
            beginnerExplanation: `Now that you understand what ${topic} is, let's see how to actually use it. Think of this like moving from theory to practice - like going from reading a recipe to actually cooking.\n\nThe key is to start small, practice regularly, and gradually take on more complex challenges. Every expert was once a beginner who kept practicing.`,
            deepTheory: `## Practical Implementation of ${topic}\n\n### Step-by-Step Approach\n1. **Identify the use case**: Understand what you're trying to achieve\n2. **Gather resources**: Collect the tools and information you need\n3. **Plan your approach**: Create a roadmap for implementation\n4. **Execute systematically**: Follow your plan and document progress\n5. **Test and refine**: Verify your work and make improvements\n\n### Best Practices\n- Always start with clear objectives\n- Document your process\n- Learn from mistakes\n- Seek feedback from others\n- Stay updated with new developments`,
            practicalExamples: [
              {
                title: "Building a Project",
                description: `When building a project using ${topic}, break it into manageable phases. Complete each phase before moving to the next.`,
                commonMistakes: `Trying to do everything at once leads to overwhelm and errors.`,
                correction: `Use an iterative approach - build, test, improve, repeat.`
              }
            ],
            handsOnExercises: [
              {
                exercise: `Create a simple project plan for applying ${topic} to a problem in your domain.`,
                difficulty: "Medium",
                solution: `Outline: 1) Problem statement, 2) How ${topic} helps, 3) Implementation steps, 4) Success criteria`
              },
              {
                exercise: `Find a case study of ${topic} being used successfully and analyze what made it work.`,
                difficulty: "Medium",
                solution: `Look for key success factors: clear goals, proper planning, skilled execution, and continuous improvement.`
              }
            ],
            caseStudy: {
              title: `Successful Implementation`,
              scenario: `A professional applies ${topic} to streamline their workflow and achieves measurable improvements.`,
              steps: [
                "Identified inefficiencies in current process",
                "Mapped how ${topic} could help",
                "Implemented changes incrementally",
                "Monitored results and adjusted",
                "Scaled successful practices"
              ],
              outcome: `Productivity increased by applying ${topic} principles systematically.`
            },
            chapterQuiz: {
              questions: [
                {
                  question: `What's the most important factor when applying ${topic}?`,
                  options: [
                    "Having expensive tools",
                    "Clear understanding of objectives",
                    "Working alone",
                    "Rushing through implementation"
                  ],
                  correctAnswer: "Clear understanding of objectives",
                  explanation: "Knowing what you want to achieve guides all your decisions and actions."
                }
              ]
            },
            estimatedHours: 4
          }
        ]
      }
    ],
    projects: {
      miniProject: {
        title: `${topic} Mini Challenge`,
        description: `Apply what you've learned to solve a practical problem using ${topic}. This hands-on project will reinforce your understanding.`,
        requirements: [
          "Identify a real problem or use case",
          `Apply ${topic} concepts to address it`,
          "Document your approach and solution",
          "Reflect on what you learned"
        ],
        sampleSolution: `Choose a problem relevant to your interests. Research how ${topic} is used in that context. Create a plan and implement it step by step. Test your solution and iterate based on results.`,
        improvementIdeas: [
          "Add more complexity gradually",
          "Collaborate with others for feedback",
          "Document lessons learned for future reference"
        ]
      },
      finalProject: {
        title: `${topic} Capstone Project`,
        description: `Demonstrate mastery by completing a comprehensive project that showcases your understanding of ${topic}.`,
        requirements: [
          `Deep application of ${topic} principles`,
          "Well-documented process",
          "Clear results and outcomes",
          "Presentation of learnings"
        ],
        sampleSolution: `Design a complete solution that leverages ${topic}. Include planning, implementation, testing, and documentation. Present your work to others.`,
        improvementIdeas: [
          "Get peer review",
          "Present to a broader audience",
          "Publish your findings or code"
        ]
      }
    },
    revisionNotes: `## ${topic} - Key Takeaways\n\n### Core Concepts\n- ${topic} provides structured approaches to solving problems\n- Understanding fundamentals is crucial before advancing\n- Practice and application reinforce learning\n\n### Best Practices\n- Start simple and build complexity gradually\n- Document your learning journey\n- Apply concepts to real-world scenarios\n- Seek feedback and iterate\n\n### Next Steps\n- Continue practicing with diverse examples\n- Explore advanced topics\n- Join communities of practice\n- Share your knowledge with others\n\n**Note**: For comprehensive AI-generated content with detailed examples, exercises, and industry-specific case studies, please try again when the AI service becomes available.`,
    finalAssessment: {
      questions: [
        {
          question: `What is the most effective way to learn ${topic}?`,
          options: [
            "Rushing through all material quickly",
            "Understanding basics, then practicing regularly",
            "Only reading without practice",
            "Skipping fundamentals"
          ],
          correctAnswer: "Understanding basics, then practicing regularly",
          explanation: "Combining theoretical understanding with consistent practice is the most effective learning approach."
        },
        {
          question: `When applying ${topic}, you should:`,
          options: [
            "Start with the most complex problems",
            "Begin with simple applications and build up",
            "Work without a plan",
            "Avoid documenting your process"
          ],
          correctAnswer: "Begin with simple applications and build up",
          explanation: "Progressive learning - starting simple and advancing gradually - builds solid expertise."
        },
        {
          question: `Why is ${topic} valuable?`,
          options: [
            "It makes work more complicated",
            "It provides structured solutions to challenges",
            "It replaces the need for thinking",
            "It's only for experts"
          ],
          correctAnswer: "It provides structured solutions to challenges",
          explanation: `${topic} offers systematic approaches to solving real-world problems effectively.`
        }
      ]
    },
    resources: {
      youtubePlaylists: [],
      recommendedBooks: [],
      articles: [],
      documentation: [],
      tools: [],
      courses: []
    }
  };
}

function createDefaultQuiz(topic) {
  return {
    title: `${topic} Quiz`,
    questions: [
      {
        question: `What is ${topic}?`,
        options: ["A tool", "A concept", "A language", "None"],
        correctAnswer: "A concept",
        explanation: "It is a core concept."
      }
    ]
  };
}

module.exports = { generateCourseContent, generateQuiz };
