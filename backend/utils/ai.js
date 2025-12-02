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
- Create 4-6 modules with DIFFERENT structures and themes:
  * Module 1: "Getting Started" - Foundation concepts, basics
  * Module 2: "Core Concepts" - Main principles, building blocks
  * Module 3: "Advanced Techniques" - Deeper dive, complex topics
  * Module 4: "Real-World Applications" - Practical use cases, industry examples
  * Module 5: "Mastery & Optimization" - Best practices, advanced strategies
  * Module 6: "Capstone & Projects" - Final projects, integration
  
- Each module should have 2-4 lessons with VARIED content:
  * Mix of theoretical and practical lessons
  * Some lessons focus on concepts, others on hands-on practice
  * Vary the depth and complexity within each module
  
- Each lesson MUST include all 9 sections but vary the emphasis:
  * Some lessons emphasize examples, others emphasize theory
  * Vary the number of exercises (8-12 per lesson)
  * Vary the number of practical examples (5-10 per lesson)
  
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

// --- Fallback Functions (Keep these just in case) ---

function createDefaultCourse(topic) {
  return {
    title: `Mastering ${topic} (Offline Mode)`,
    description: `A comprehensive guide to ${topic}. (Generated in offline mode due to connection issues)`,
    learningOutcomes: ["Understand core concepts", "Apply knowledge", "Build projects"],
    estimatedDuration: "4 weeks",
    estimatedLearningHours: 20,
    modules: [
      {
        moduleTitle: "Introduction",
        level: "Beginner",
        moduleOverview: "Basics of the topic.",
        estimatedHours: 5,
        lessons: [
          {
            lessonTitle: "Overview",
            beginnerExplanation: `${topic} is a fundamental concept that...`,
            deepTheory: `## Deep Dive into ${topic}\n\nUnderstanding ${topic} requires...`,
            practicalExamples: [
              {
                title: "Basic Example",
                description: "A simple example to get started",
                commonMistakes: "Common mistakes include...",
                correction: "To avoid this, remember to..."
              }
            ],
            handsOnExercises: [
              {
                exercise: "What is the basic concept of " + topic + "?",
                difficulty: "Easy",
                solution: "The basic concept is..."
              }
            ],
            caseStudy: {
              title: "Real-World Application",
              scenario: "In a real-world scenario...",
              steps: ["Step 1", "Step 2"],
              outcome: "Expected outcome"
            },
            chapterQuiz: {
              questions: [
                {
                  question: `What is ${topic}?`,
                  options: ["Option A", "Option B", "Option C", "Option D"],
                  correctAnswer: "Option A",
                  explanation: "This is correct because..."
                }
              ]
            },
            estimatedHours: 2
          }
        ]
      }
    ],
    projects: {
      miniProject: {
        title: "Mini Project",
        description: "A small project to practice",
        requirements: ["Requirement 1"],
        sampleSolution: "Sample solution",
        improvementIdeas: ["Idea 1"]
      },
      finalProject: {
        title: "Final Project",
        description: "A comprehensive project",
        requirements: ["Requirement 1"],
        sampleSolution: "Sample solution",
        improvementIdeas: ["Idea 1"]
      }
    },
    revisionNotes: `## Revision Notes for ${topic}\n\nKey points:\n- Point 1\n- Point 2`,
    finalAssessment: {
      questions: [
        {
          question: `What is ${topic}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A",
          explanation: "Explanation"
        }
      ]
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
