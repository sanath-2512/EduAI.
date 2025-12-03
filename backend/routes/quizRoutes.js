const express = require('express');
const router = express.Router();
const { createQuiz, getQuizzesByCourse, getQuizById, getAllQuizzes, deleteQuiz } = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createQuiz);
router.get('/', authMiddleware, getAllQuizzes); // Get all user's quizzes
router.get('/course/:courseId', getQuizzesByCourse);
router.get('/:id', getQuizById);
router.delete('/:id', authMiddleware, deleteQuiz);

module.exports = router;
