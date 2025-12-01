const express = require('express');
const router = express.Router();
const { updateProgress, getProgress } = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, updateProgress);
router.get('/:courseId', authMiddleware, getProgress);

module.exports = router;
