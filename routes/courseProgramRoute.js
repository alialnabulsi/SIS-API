const express = require('express');
const CourseProgramController = require('../controllers/courseProgramController');
const { validateCourseProgram, validateCourseProgramIDParam, validateCourseAndProgramParams, validateCourseProgramUpdate } = require('../validators/courseProgramDTO');

const router = express.Router();

router.post('/', validateCourseProgram, CourseProgramController.createCourseProgram);
router.get('/:courseProgramID', validateCourseProgramIDParam, CourseProgramController.getCourseProgram);
router.get('/course/:courseID/program/:programID', validateCourseAndProgramParams, CourseProgramController.getCourseProgramByCourseAndProgram);
router.get('/', CourseProgramController.getAllCoursePrograms);
router.put('/:courseProgramID', validateCourseProgramUpdate, CourseProgramController.updateCourseProgram);
router.delete('/:courseProgramID', validateCourseProgramIDParam, CourseProgramController.deleteCourseProgram);
router.delete('/', CourseProgramController.deleteAllCoursePrograms);

module.exports = router;