const BuildingRepository = require("../repositories/buildingRepository");
const Building = require("../models/buildingModel");
const CampusService = require("./campusService");

class BuildingService {
    static async createBuilding(building) {
        try {
            // Check if the campus exists
            const campusExists = await CampusService.getCampusByID(building.campusID);
            if (!campusExists) {
                const error = new Error("Campus does not exist");
                error.statusCode = 404;
                throw error;
            }

            return BuildingRepository.createBuilding(building);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createBuilding service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getBuilding(name) {
        try {
            return BuildingRepository.getBuilding(name);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getBuilding service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getBuildingByID(buildingID) {
        try {
            return BuildingRepository.getBuildingByID(buildingID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getBuildingByID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllBuildings() {
        try {
            return BuildingRepository.getAllBuildings();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllBuildings service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateBuilding(buildingID, updates) {
        try {
            return BuildingRepository.updateBuilding(buildingID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateBuilding service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteBuilding(name) {
        try {
            return BuildingRepository.deleteBuilding(name);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteBuilding service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllBuildings() {
        try {
            return BuildingRepository.deleteAllBuildings();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllBuildings service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = BuildingService;
