const { PrismaClient } = require('@prisma/client');
const { generateCourseContent, generateQuiz } = require('../utils/ai');

const prisma = new PrismaClient();

exports.createCourse = async (req, res) => {
  try {
    const { title, description, topic, useAI } = req.body;
    let courseData = {
      title,
      description,
      topic: topic || title,
      userId: req.user.userId,
      content: {}
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
      courseData.content = aiContent; // Store entire AI response as JSON
      
      console.log(`💾 Saving course with ${aiContent.modules.length} modules...`);
      
      const course = await prisma.course.create({
        data: courseData
      });
      
      console.log(`✅ Course saved successfully: ${course.id}`);
      
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
        
        // If we have questions, create quiz
        if (allQuestions.length > 0) {
          await prisma.quiz.create({
            data: {
              topic: `${course.title} - Comprehensive Quiz`,
              questions: allQuestions,
              userId: req.user.userId
            }
          });
        } else {
          // Generate quiz if no questions in course
          const quizData = await generateQuiz(topic, aiContent.modules);
          await prisma.quiz.create({
            data: {
              topic: quizData.title || `${topic} Quiz`,
              questions: quizData.questions || [],
              userId: req.user.userId
            }
          });
        }
      } catch (quizError) {
        console.error('Error auto-generating quiz:', quizError);
      }
      
      // Add _id for frontend compatibility
      const courseResponse = { ...course, _id: course.id };
      return res.status(201).json(courseResponse);
    }

    const course = await prisma.course.create({
      data: courseData
    });
    
    const courseResponse = { ...course, _id: course.id };
    res.status(201).json(courseResponse);
  } catch (err) {
    console.error('Error in createCourse:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get User's Courses
exports.getCourses = async (req, res) => {
  try {
    const { search, sort, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const where = { userId: req.user.userId };
    
    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { topic: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Sorting
    let orderBy = { createdAt: 'desc' }; // Default: newest first
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'title') orderBy = { title: 'asc' };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          user: {
            select: { id: true, username: true, email: true }
          }
        },
        orderBy,
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.course.count({ where })
    ]);

    // Add _id for frontend compatibility
    const coursesWithId = courses.map(c => ({ ...c, _id: c.id }));

    res.json({
      courses: coursesWithId,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalCourses: total
    });
  } catch (err) {
    console.error('Get courses error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get All Public Courses
exports.getAllCourses = async (req, res) => {
  try {
    const { search, sort, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const where = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { topic: { contains: search, mode: 'insensitive' } }
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'title') orderBy = { title: 'asc' };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          user: {
            select: { id: true, username: true, email: true }
          }
        },
        orderBy,
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.course.count({ where })
    ]);

    // Add _id for frontend compatibility
    const coursesWithId = courses.map(c => ({ ...c, _id: c.id }));

    res.json({
      courses: coursesWithId,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalCourses: total
    });
  } catch (err) {
    console.error('Get all courses error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: { id: true, username: true, email: true }
        }
      }
    });
    
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Add _id for frontend compatibility
    const courseResponse = { ...course, _id: course.id };
    res.json(courseResponse);
  } catch (err) {
    console.error('Get course by ID error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Check if course exists and belongs to user
    const course = await prisma.course.findUnique({
      where: { id: req.params.id }
    });
    
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.userId !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    
    const updatedCourse = await prisma.course.update({
      where: { id: req.params.id },
      data: updateData
    });
    
    res.json(updatedCourse);
  } catch (err) {
    console.error('Update course error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id }
    });
    
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    if (course.userId !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete associated quizzes and progress
    await prisma.quiz.deleteMany({ where: { userId: req.user.userId } });
    await prisma.progress.deleteMany({ where: { courseId: req.params.id } });
    
    // Delete course
    await prisma.course.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Course and associated data removed successfully' });
  } catch (err) {
    console.error('Delete course error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
