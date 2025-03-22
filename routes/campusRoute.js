const express = require('express');
const CampusController = require('../controllers/campusController');
const { validateCampus, validateCampusParam, validateCampusUpdate } = require('../validators/campusDTO');

const router = express.Router();

router.post('/', validateCampus, CampusController.createCampus);
router.get('/', CampusController.getAllCampuses);
router.get('/:campusId', validateCampusParam, CampusController.getCampus);
router.put('/:campusId', validateCampusUpdate, CampusController.updateCampus);
router.delete('/:campusId', validateCampusParam, CampusController.deleteCampus);
router.delete('/', CampusController.deleteAllCampuses);

module.exports = router;
