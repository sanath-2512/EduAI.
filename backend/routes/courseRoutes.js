const express = require('express');
const router = express.Router();
const { createCourse, getCourses, getAllCourses, getCourseById, updateCourse, deleteCourse } = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createCourse);
router.get('/', authMiddleware, getCourses); // User's own courses
router.get('/all', getAllCourses); // All public courses
router.get('/:id', getCourseById);
router.put('/:id', authMiddleware, updateCourse); // Update course
router.delete('/:id', authMiddleware, deleteCourse);

module.exports = router;
