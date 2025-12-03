const { PrismaClient } = require('@prisma/client');
const { generateQuiz } = require('../utils/ai');

const prisma = new PrismaClient();

exports.createQuiz = async (req, res) => {
  try {
    const { courseId, topic, useAI, title, questions } = req.body;
    let quizData = {
      topic: topic || title,
      userId: req.user.userId,
      questions: questions || []
    };

    if (useAI && topic) {
      console.log(`🎯 Generating AI quiz for topic: ${topic}`);
      const aiQuiz = await generateQuiz(topic);
      quizData.topic = aiQuiz.title || title || topic;
      quizData.questions = aiQuiz.questions || [];
    }

    const quiz = await prisma.quiz.create({
      data: quizData
    });
    
    res.status(201).json(quiz);
  } catch (err) {
    console.error('Create quiz error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { userId: req.user.userId }
    });
    
    res.json(quizzes);
  } catch (err) {
    console.error('Get quizzes error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id }
    });
    
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    res.json(quiz);
  } catch (err) {
    console.error('Get quiz by ID error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { userId: req.user.userId },
      include: {
        user: {
          select: { id: true, username: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(quizzes);
  } catch (err) {
    console.error('Get all quizzes error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id }
    });
    
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    if (quiz.userId !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await prisma.quiz.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    console.error('Delete quiz error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
