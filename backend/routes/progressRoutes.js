const express = require('express');
const router = express.Router();
const { updateProgress, getProgress, getUserStats } = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, updateProgress); // Update progress
router.get('/', authMiddleware, getProgress); // Get user progress
router.get('/stats', authMiddleware, getUserStats); // Get user stats

module.exports = router;
