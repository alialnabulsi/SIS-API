const express = require('express');
const BuildingController = require('../controllers/buildingController');
const { validateBuilding, validateBuildingIDParam, validateNameParam, validateBuildingUpdate } = require('../validators/buildingDTO');

const router = express.Router();

router.post('/', validateBuilding, BuildingController.createBuilding);
router.get('/:name', validateNameParam, BuildingController.getBuilding);
router.get('/id/:buildingID', validateBuildingIDParam, BuildingController.getBuildingByID);
router.get('/', BuildingController.getAllBuildings);
router.put('/:buildingID', validateBuildingUpdate, BuildingController.updateBuilding);
router.delete('/:name', validateBuildingIDParam, BuildingController.deleteBuilding);
router.delete('/', BuildingController.deleteAllBuildings);

module.exports = router;
