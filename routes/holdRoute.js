const express = require('express');
const HoldController = require('../controllers/holdController');
const { validateHold, validateHoldIDParam, validateStudentIDParam, validateSemesterIDParam } = require('../validators/holdDTO');

const router = express.Router();

router.post('/', validateHold, HoldController.createHold);
router.get('/:holdID', validateHoldIDParam, HoldController.getHoldByID);
router.get('/student/:studentID', validateStudentIDParam, HoldController.getHoldsByStudentID);
router.get('/semester/:semesterID', validateSemesterIDParam, HoldController.getHoldsBySemesterID);
router.put('/:holdID', validateHoldIDParam, HoldController.updateHold);
router.delete('/:holdID', validateHoldIDParam, HoldController.deleteHold);
router.delete('/student/:studentID', validateStudentIDParam, HoldController.deleteAllHoldsForStudent);
router.delete('/semester/:semesterID', validateSemesterIDParam, HoldController.deleteAllHoldsForSemester);

module.exports = router;