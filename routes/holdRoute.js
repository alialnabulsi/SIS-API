const express = require('express');
const HoldController = require('../controllers/holdController');
const { validateHold, validateHoldIDParam,validateHoldUpdate} = require('../validators/holdDTO');

const router = express.Router();

router.post('/', validateHold, HoldController.createHold);
router.get('/:holdID', validateHoldIDParam, HoldController.getHoldByID);
router.put('/:holdID', validateHoldUpdate, HoldController.updateHold);
router.delete('/:holdID', validateHoldIDParam, HoldController.deleteHold);

module.exports = router;