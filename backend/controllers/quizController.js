const Quiz = require('../models/Quiz');
const { generateQuiz } = require('../utils/ai');

exports.createQuiz = async (req, res) => {
  try {
    const { courseId, topic, useAI, title, questions } = req.body;
    let quizData = {
      courseId,
      title,
      questions: questions || []
    };

    if (useAI && topic) {
      const aiQuiz = await generateQuiz(topic);
      quizData.title = aiQuiz.title || title;
      quizData.questions = aiQuiz.questions || [];
    }

    const quiz = new Quiz(quizData);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ courseId: req.params.courseId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
