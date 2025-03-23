const express = require('express');
const ScheduleController = require('../controllers/scheduleController');
const { validateSchedule, validateScheduleIDParam, validateRoomAndTimeParams, validateScheduleUpdate } = require('../validators/scheduleDTO');

const router = express.Router();

router.post('/', validateSchedule, ScheduleController.createSchedule);
router.get('/:scheduleID', validateScheduleIDParam, ScheduleController.getSchedule);
router.get('/room/:roomID/startTime/:startTime/endTime/:endTime/day/:day', validateRoomAndTimeParams, ScheduleController.getScheduleByRoomAndTime);
router.get('/', ScheduleController.getAllSchedules);
router.put('/:scheduleID', validateScheduleUpdate, ScheduleController.updateSchedule);
router.delete('/:scheduleID', validateScheduleIDParam, ScheduleController.deleteSchedule);
router.delete('/', ScheduleController.deleteAllSchedules);

module.exports = router;