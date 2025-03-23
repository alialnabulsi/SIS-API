const express = require('express');
const EnrollmentController = require('../controllers/enrollmentController');
const { validateEnrollment, validateEnrollmentIDParam, validateEnrollmentUpdate } = require('../validators/enrollmentDTO');

const router = express.Router();

router.post('/', validateEnrollment, EnrollmentController.createEnrollment);
router.get('/:enrollmentID', validateEnrollmentIDParam, EnrollmentController.getEnrollment);
router.get('/', EnrollmentController.getAllEnrollments);
router.put('/:enrollmentID', validateEnrollmentUpdate, EnrollmentController.updateEnrollment);
router.delete('/:enrollmentID', validateEnrollmentIDParam, EnrollmentController.deleteEnrollment);
router.delete('/', EnrollmentController.deleteAllEnrollments);

module.exports = router;