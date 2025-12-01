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
      const aiContent = await generateCourseContent(topic);
      courseData.title = aiContent.title || title;
      courseData.description = aiContent.description || description;
      courseData.content = aiContent.content || [];
      courseData.generatedByAI = true;
      
      // Create the course first
      const course = new Course(courseData);
      await course.save();
      
      // Auto-generate quiz for the course
      try {
        const quizData = await generateQuiz(topic, aiContent.content);
        const quiz = new Quiz({
          courseId: course._id,
          title: quizData.title || `${topic} Quiz`,
          questions: quizData.questions || []
        });
        await quiz.save();
        console.log('Quiz auto-generated for course:', course._id);
      } catch (quizError) {
        console.error('Error auto-generating quiz:', quizError);
        // Continue even if quiz generation fails
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

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'username');
    res.json(courses);
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

    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
