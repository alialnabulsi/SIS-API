const express = require('express');
const LocationController = require('../controllers/locationController');
const { validateLocation,validateCityParam,validateLocationUpdate } = require('../validators/locationDTO');

const router = express.Router();

router.post('/',validateLocation ,LocationController.createLocation);
router.get('/' , LocationController.getAllLocations);
router.get('/:city',validateCityParam, LocationController.getLocation);
router.put('/:city', validateLocationUpdate,LocationController.updateLocation);
router.delete('/:city', validateCityParam,LocationController.deleteLocation );


module.exports = router;