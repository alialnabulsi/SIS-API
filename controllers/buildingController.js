const Building = require("../models/buildingModel");
const BuildingService = require("../services/buildingService");

class BuildingController {
    static async createBuilding(req, res) {
        try {
            const { campusID, name, numberOfFloors } = req.body;
            const building = new Building(0, campusID, name, numberOfFloors);
            const result = await BuildingService.createBuilding(building);
            res.status(201).json(result);
        } catch (e) {
            if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'Building already exists', error: e.message });
            } else if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Campus does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getBuilding(req, res) {
        try {
            const { name } = req.params;
            const result = await BuildingService.getBuilding(name);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Building not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getBuildingByID(req, res) {
        try {
            const { buildingID } = req.params;
            const result = await BuildingService.getBuildingByID(buildingID);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Building not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllBuildings(req, res) {
        try {
            const result = await BuildingService.getAllBuildings();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No buildings found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateBuilding(req, res) {
        try {
            const { name } = req.params;
            const updates = req.body;
            const result = await BuildingService.updateBuilding(name, updates);
            res.status(204).json(result);
        } catch (e) {
            if (e.statusCode === 400) {
                res.status(e.statusCode).json({ message: 'No updates provided', error: e.message });
            } else if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'The new Building name already exists', error: e.message });
            } else if (e.statusCode === 404) {
                const message = e.campusNotFound
                    ? 'Campus not found'  // If campusNotFound is true
                    : 'Building not found'; 
                res.status(e.statusCode).json({ message, error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteBuilding(req, res) {
        try {
            const { name } = req.params;
            const result = await BuildingService.deleteBuilding(name);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Building not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllBuildings(req, res) {
        try {
            const result = await BuildingService.deleteAllBuildings();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No buildings found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = BuildingController;
