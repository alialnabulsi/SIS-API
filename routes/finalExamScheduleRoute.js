const express = require('express');
const FinalExamScheduleController = require('../controllers/finalExamScheduleController');
const { validateFinalExamSchedule, validateFinalExamScheduleIDParam, validateFinalExamScheduleUpdate } = require('../validators/finalExamScheduleDTO');

const router = express.Router();

router.post('/', validateFinalExamSchedule, FinalExamScheduleController.createFinalExamSchedule);
router.get('/:finalExamScheduleID', validateFinalExamScheduleIDParam, FinalExamScheduleController.getFinalExamSchedule);
router.get('/', FinalExamScheduleController.getAllFinalExamSchedules);
router.put('/:finalExamScheduleID', validateFinalExamScheduleUpdate, FinalExamScheduleController.updateFinalExamSchedule);
router.delete('/:finalExamScheduleID', validateFinalExamScheduleIDParam, FinalExamScheduleController.deleteFinalExamSchedule);
router.delete('/', FinalExamScheduleController.deleteAllFinalExamSchedules);

module.exports = router;