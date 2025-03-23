const express = require('express');
const StudentController = require('../controllers/studentController');
const { validateStudent, validateStudentIDParam, validateUserIDParam, validateStudentUpdate } = require('../validators/studentDTO');

const router = express.Router();

router.post('/', validateStudent, StudentController.createStudent);
router.get('/:studentID', validateStudentIDParam, StudentController.getStudent);
router.get('/user/:userID', validateUserIDParam, StudentController.getStudentByUserID);
router.get('/', StudentController.getAllStudents);
router.put('/:studentID', validateStudentUpdate, StudentController.updateStudent);
router.delete('/:studentID', validateStudentIDParam, StudentController.deleteStudent);
router.delete('/', StudentController.deleteAllStudents);

module.exports = router;