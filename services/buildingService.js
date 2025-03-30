const BuildingRepository = require("../repositories/buildingRepository");
const Building = require("../models/buildingModel");
const CampusService = require("./campusService");

class BuildingService {
    static async createBuilding(building) {
        // Check if the campus exists
        const campusExists = await CampusService.getCampusByID(building.campusID);
        if (!campusExists) {
            const error = new Error("Campus does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            return BuildingRepository.createBuilding(building);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getBuilding(name) {
        try {
            return BuildingRepository.getBuilding(name);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getBuildingByID(buildingID) {
        try {
            return BuildingRepository.getBuildingByID(buildingID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getAllBuildings() {
        try {
            return BuildingRepository.getAllBuildings();
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async updateBuilding(name, updates) {
        // Check if the campus exists

        if (updates.campusID) {
            const campusExists = await CampusService.getCampusByID(updates.campusID);
            if (!campusExists) {
                const error = new Error("campus does not exist");
                error.statusCode = 404;
                error.campusNotFound = true;
                throw error;
            }
        }
        try {
            return BuildingRepository.updateBuilding(name, updates);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteBuilding(name) {
        try {
            return BuildingRepository.deleteBuilding(name);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteAllBuildings() {
        try {
            return BuildingRepository.deleteAllBuildings();
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = BuildingService;
