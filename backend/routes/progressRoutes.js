const express = require('express');
const router = express.Router();
const { updateProgress, getProgress, trackSession } = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, updateProgress);
router.post('/session', authMiddleware, trackSession);
router.get('/:courseId', authMiddleware, getProgress);

module.exports = router;
