const express = require('express');
const MinorController = require('../controllers/minorController');
const { validateMinor, validateMinorIDParam, validateNameParam, validateMinorUpdate } = require('../validators/minorDTO');

const router = express.Router();

router.post('/', validateMinor, MinorController.createMinor);
router.get('/:name', validateNameParam, MinorController.getMinor);
router.get('/id/:minorID', validateMinorIDParam, MinorController.getMinorByID);
router.get('/', MinorController.getAllMinors);
router.put('/:minorID', validateMinorUpdate, MinorController.updateMinor);
router.delete('/:name', validateNameParam, MinorController.deleteMinor);
router.delete('/', MinorController.deleteAllMinors);

module.exports = router;