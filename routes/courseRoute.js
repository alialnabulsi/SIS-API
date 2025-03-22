const express = require('express');
const CourseController = require('../controllers/courseController');
const { validateCourse, validateCourseIDParam, validateNameParam, validateCourseUpdate } = require('../validators/courseDTO');

const router = express.Router();

router.post('/', validateCourse, CourseController.createCourse);
router.get('/:courseID', validateCourseIDParam, CourseController.getCourse);
router.get('/name/:name', validateNameParam, CourseController.getCourseByName);
router.get('/', CourseController.getAllCourses);
router.put('/:courseID', validateCourseUpdate, CourseController.updateCourse);
router.delete('/:courseID', validateCourseIDParam, CourseController.deleteCourse);
router.delete('/', CourseController.deleteAllCourses);

module.exports = router;