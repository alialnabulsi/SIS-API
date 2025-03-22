const express = require('express');
const InstructorController = require('../controllers/instructorController');
const { validateInstructor, validateInstructorIDParam, validateUserIDParam, validateDepartmentIDParam } = require('../validators/instructorDTO');

const router = express.Router();

router.post('/', validateInstructor, InstructorController.createInstructor);
router.get('/:instructorID', validateInstructorIDParam, InstructorController.getInstructorByID);
router.get('/user/:userID', validateUserIDParam, InstructorController.getInstructorByUserID);
router.get('/department/:departmentID', validateDepartmentIDParam, InstructorController.getInstructorsByDepartmentID);
router.put('/:instructorID', validateInstructorIDParam, InstructorController.updateInstructor);
router.delete('/:instructorID', validateInstructorIDParam, InstructorController.deleteInstructor);

module.exports = router;