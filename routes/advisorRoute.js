const express = require('express');
const AdvisorController = require('../controllers/advisorController');
const { validateAdvisor, validateAdvisorIDParam, validateUserIDParam, validateDepartmentIDParam } = require('../validators/advisorDTO');

const router = express.Router();

router.post('/', validateAdvisor, AdvisorController.createAdvisor);
router.get('/:advisorID', validateAdvisorIDParam, AdvisorController.getAdvisorByID);
router.get('/user/:userID', validateUserIDParam, AdvisorController.getAdvisorByUserID);
router.get('/department/:departmentID', validateDepartmentIDParam, AdvisorController.getAdvisorsByDepartmentID);
router.put('/:advisorID', validateAdvisorIDParam, AdvisorController.updateAdvisor);
router.delete('/:advisorID', validateAdvisorIDParam, AdvisorController.deleteAdvisor);
router.delete('/', AdvisorController.deleteAllAdvisors);

module.exports = router;