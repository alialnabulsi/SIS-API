const express = require('express');
const MajorController = require('../controllers/majorController');
const { validateMajor, validateMajorIDParam, validateNameParam, validateMajorUpdate } = require('../validators/majorDTO');

const router = express.Router();

router.post('/', validateMajor, MajorController.createMajor);
router.get('/:name', validateNameParam, MajorController.getMajor);
router.get('/id/:majorID', validateMajorIDParam, MajorController.getMajorByID);
router.get('/', MajorController.getAllMajors);
router.put('/:majorID', validateMajorUpdate, MajorController.updateMajor);
router.delete('/:name', validateNameParam, MajorController.deleteMajor);
router.delete('/', MajorController.deleteAllMajors);

module.exports = router;