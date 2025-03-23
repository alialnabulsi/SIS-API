const express = require('express');
const FinalExamController = require('../controllers/finalExamController');
const { validateFinalExam, validateFinalExamIDParam, validateCourseIDParam, validateFinalExamUpdate } = require('../validators/finalExamDTO');

const router = express.Router();

router.post('/', validateFinalExam, FinalExamController.createFinalExam);
router.get('/:finalExamID', validateFinalExamIDParam, FinalExamController.getFinalExam);
router.get('/course/:courseID', validateCourseIDParam, FinalExamController.getFinalExamByCourse);
router.get('/', FinalExamController.getAllFinalExams);
router.put('/:finalExamID', validateFinalExamUpdate, FinalExamController.updateFinalExam);
router.delete('/:finalExamID', validateFinalExamIDParam, FinalExamController.deleteFinalExam);
router.delete('/', FinalExamController.deleteAllFinalExams);

module.exports = router;