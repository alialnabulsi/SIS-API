const express = require('express');
const SemesterController = require('../controllers/semesterController');
const { validateSemester, validateSemesterIDParam, validateNameAndYearParams, validateSemesterUpdate } = require('../validators/semesterDTO');

const router = express.Router();

router.post('/', validateSemester, SemesterController.createSemester);
router.get('/:semesterID', validateSemesterIDParam, SemesterController.getSemester);
router.get('/name/:name/year/:year', validateNameAndYearParams, SemesterController.getSemesterByNameAndYear);
router.get('/', SemesterController.getAllSemesters);
router.put('/:semesterID', validateSemesterUpdate, SemesterController.updateSemester);
router.delete('/:semesterID', validateSemesterIDParam, SemesterController.deleteSemester);
router.delete('/', SemesterController.deleteAllSemesters);

module.exports = router;