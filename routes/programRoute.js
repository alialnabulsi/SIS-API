const express = require('express');
const ProgramController = require('../controllers/programController');
const { validateProgram, validateProgramIDParam, validateNameParam, validateProgramUpdate } = require('../validators/programDTO');

const router = express.Router();

router.post('/', validateProgram, ProgramController.createProgram);
router.get('/:name', validateNameParam, ProgramController.getProgram);
router.get('/id/:programID', validateProgramIDParam, ProgramController.getProgramByID);
router.get('/', ProgramController.getAllPrograms);
router.put('/:programID', validateProgramUpdate, ProgramController.updateProgram);
router.delete('/:name', validateNameParam, ProgramController.deleteProgram);
router.delete('/', ProgramController.deleteAllPrograms);

module.exports = router;