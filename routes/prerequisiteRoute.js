const express = require('express');
const PrerequisiteController = require('../controllers/prerequisiteController');
const { validatePrerequisite, validatePrerequisiteIDParam, validateCourseAndPrerequisiteParams, validatePrerequisiteUpdate } = require('../validators/prerequisiteDTO');

const router = express.Router();

router.post('/', validatePrerequisite, PrerequisiteController.createPrerequisite);
router.get('/:prerequisiteCourseID', validatePrerequisiteIDParam, PrerequisiteController.getPrerequisite);
router.get('/course/:courseID/prerequisite/:prerequisiteID', validateCourseAndPrerequisiteParams, PrerequisiteController.getPrerequisiteByCourseAndPrerequisite);
router.get('/', PrerequisiteController.getAllPrerequisites);
router.put('/:prerequisiteCourseID', validatePrerequisiteUpdate, PrerequisiteController.updatePrerequisite);
router.delete('/:prerequisiteCourseID', validatePrerequisiteIDParam, PrerequisiteController.deletePrerequisite);
router.delete('/', PrerequisiteController.deleteAllPrerequisites);

module.exports = router;