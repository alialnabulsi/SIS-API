const express = require('express');
const FacultyController = require('../controllers/facultyController');
const { validateFaculty, validateFacultyIDParam, validateNameParam, validateFacultyUpdate } = require('../validators/facultyDTO');

const router = express.Router();

router.post('/', validateFaculty, FacultyController.createFaculty);
router.get('/:name', validateNameParam, FacultyController.getFaculty);
router.get('/id/:facultyID', validateFacultyIDParam, FacultyController.getFacultyByID);
router.get('/', FacultyController.getAllFaculties);
router.put('/:facultyID', validateFacultyUpdate, FacultyController.updateFaculty);
router.delete('/:name', validateNameParam, FacultyController.deleteFaculty);
router.delete('/', FacultyController.deleteAllFaculties);

module.exports = router;