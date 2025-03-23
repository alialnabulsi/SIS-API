const express = require('express');
const SectionController = require('../controllers/sectionController');
const { validateSection, validateSectionIDParam, validateSectionUpdate } = require('../validators/sectionDTO');

const router = express.Router();

router.post('/', validateSection, SectionController.createSection);
router.get('/:sectionID', validateSectionIDParam, SectionController.getSection);
router.get('/', SectionController.getAllSections);
router.put('/:sectionID', validateSectionUpdate, SectionController.updateSection);
router.delete('/:sectionID', validateSectionIDParam, SectionController.deleteSection);
router.delete('/', SectionController.deleteAllSections);

module.exports = router;