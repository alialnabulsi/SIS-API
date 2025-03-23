const express = require('express');
const StudentHoldController = require('../controllers/studentHoldController');
const { validateStudentHold, validateStudentHoldIDParam, validateStudentAndHoldParams, validateStudentHoldUpdate } = require('../validators/studentHoldDTO');

const router = express.Router();

router.post('/', validateStudentHold, StudentHoldController.createStudentHold);
router.get('/:studentHoldID', validateStudentHoldIDParam, StudentHoldController.getStudentHold);
router.get('/student/:studentID/hold/:holdID', validateStudentAndHoldParams, StudentHoldController.getStudentHoldByStudentAndHold);
router.get('/', StudentHoldController.getAllStudentHolds);
router.put('/:studentHoldID', validateStudentHoldUpdate, StudentHoldController.updateStudentHold);
router.delete('/:studentHoldID', validateStudentHoldIDParam, StudentHoldController.deleteStudentHold);
router.delete('/', StudentHoldController.deleteAllStudentHolds);

module.exports = router;