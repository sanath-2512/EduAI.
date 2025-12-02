const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const { generateCourseContent, generateQuiz } = require('../utils/ai');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, topic, useAI } = req.body;
    let courseData = {
      title,
      description,
      instructor: req.user.userId,
      content: []
    };

    if (useAI && topic) {
      console.log(`🎯 Generating AI course for topic: ${topic}`);
      const aiContent = await generateCourseContent(topic);
      
      // Validate AI content
      if (!aiContent || !aiContent.modules || !Array.isArray(aiContent.modules)) {
        console.error('❌ Invalid AI content received:', aiContent);
        return res.status(500).json({ 
          message: 'Failed to generate course content. Please try again.',
          error: 'Invalid AI response structure'
        });
      }
      
      console.log(`✅ AI Content received: ${aiContent.modules.length} modules`);
      
      courseData.title = aiContent.title || title || `Course on ${topic}`;
      courseData.description = aiContent.description || description || `Learn ${topic}`;
      courseData.content = aiContent.modules || [];
      courseData.learningOutcomes = aiContent.learningOutcomes || [];
      courseData.estimatedDuration = aiContent.estimatedDuration || "Flexible";
      courseData.estimatedLearningHours = aiContent.estimatedLearningHours || 0;
      courseData.projects = aiContent.projects || {};
      courseData.revisionNotes = aiContent.revisionNotes || "";
      courseData.finalAssessment = aiContent.finalAssessment || { questions: [] };
      courseData.resources = aiContent.resources || {};
      courseData.generatedByAI = true;
      
      console.log(`💾 Saving course with ${courseData.content.length} modules...`);
      const course = new Course(courseData);
      await course.save();
      console.log(`✅ Course saved successfully: ${course._id}`);
      
      try {
        // Create comprehensive quiz from course content
        let allQuestions = [];
        
        // Collect questions from chapter quizzes
        if (aiContent.modules && aiContent.modules.length > 0) {
          aiContent.modules.forEach((module) => {
            if (module.lessons && module.lessons.length > 0) {
              module.lessons.forEach((lesson) => {
                if (lesson.chapterQuiz && lesson.chapterQuiz.questions) {
                  allQuestions = allQuestions.concat(lesson.chapterQuiz.questions);
                }
              });
            }
          });
        }
        
        // Add final assessment questions
        if (aiContent.finalAssessment && aiContent.finalAssessment.questions) {
          allQuestions = allQuestions.concat(aiContent.finalAssessment.questions);
        }
        
        // If we have questions, create quiz, otherwise generate one
        if (allQuestions.length > 0) {
          const quiz = new Quiz({
            courseId: course._id,
            title: `${course.title} - Comprehensive Quiz`,
            questions: allQuestions
          });
          await quiz.save();
        } else {
          // Generate quiz if no questions in course
          const quizData = await generateQuiz(topic, aiContent.modules);
          const quiz = new Quiz({
            courseId: course._id,
            title: quizData.title || `${topic} Quiz`,
            questions: quizData.questions || []
          });
          await quiz.save();
        }
      } catch (quizError) {
        console.error('Error auto-generating quiz:', quizError);
      }
      
      return res.status(201).json(course);
    }

    const course = new Course(courseData);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error('Error in createCourse:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Course (Full CRUD)
exports.updateCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (title) course.title = title;
    if (description) course.description = description;
    
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get User's Courses with Search, Filter, Sort, Pagination
exports.getCourses = async (req, res) => {
  try {
    const { search, sort, page = 1, limit = 10, generatedByAI } = req.query;
    const query = { instructor: req.user.userId };

    // Searching
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Filtering
    if (generatedByAI) {
      query.generatedByAI = generatedByAI === 'true';
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'title') sortOption = { title: 1 };

    // Pagination
    const skip = (page - 1) * limit;

    const courses = await Course.find(query)
      .populate('instructor', 'username')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalCourses: total
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Public Courses with Search, Filter, Sort, Pagination
exports.getAllCourses = async (req, res) => {
  try {
    const { search, sort, page = 1, limit = 10, generatedByAI } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (generatedByAI) {
      query.generatedByAI = generatedByAI === 'true';
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'title') sortOption = { title: 1 };

    const skip = (page - 1) * limit;

    const courses = await Course.find(query)
      .populate('instructor', 'username')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalCourses: total
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'username');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    if (course.instructor.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Quiz.deleteMany({ courseId: req.params.id });
    await course.deleteOne();
    res.json({ message: 'Course and associated quizzes removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
