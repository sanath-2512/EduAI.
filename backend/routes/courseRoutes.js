const express = require('express');
const router = express.Router();
const { createCourse, getCourses, getCourseById, deleteCourse } = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.delete('/:id', authMiddleware, deleteCourse);

module.exports = router;
