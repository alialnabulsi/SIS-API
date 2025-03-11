const express = require('express');
const LocationController = require('../controllers/locationController');

const router = express.Router();

router.post('/', LocationController.createLocation);
router.get('/:city', LocationController.getLocation);
router.put('/:city', LocationController.updateLocation);


module.exports = router;