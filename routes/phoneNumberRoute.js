const express = require('express');
const PhoneNumberController = require('../controllers/phoneNumberController');
const { validatePhoneNumber, validatePhoneNumberIDParam, validatePhoneNumberParam, validatePhoneNumberUpdate } = require('../validators/phoneNumberDTO');

const router = express.Router();

router.post('/', validatePhoneNumber, PhoneNumberController.createPhoneNumber);
router.get('/:phoneNumber', validatePhoneNumberParam, PhoneNumberController.getPhoneNumber);
router.get('/id/:phoneNumberID', validatePhoneNumberIDParam, PhoneNumberController.getPhoneNumberByID);
router.get('/', PhoneNumberController.getAllPhoneNumbers);
router.put('/:phoneNumberID', validatePhoneNumberUpdate, PhoneNumberController.updatePhoneNumber);
router.delete('/:phoneNumber', validatePhoneNumberParam, PhoneNumberController.deletePhoneNumber);
router.delete('/', PhoneNumberController.deleteAllPhoneNumbers);

module.exports = router;