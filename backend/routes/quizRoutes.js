const express = require('express');
const router = express.Router();
const { createQuiz, getQuizzesByCourse, getQuizById } = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createQuiz);
router.get('/course/:courseId', getQuizzesByCourse);
router.get('/:id', getQuizById);

module.exports = router;
