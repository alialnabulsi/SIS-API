const CampusRepository = require("../repositories/campusRepository");
const Campus = require("../models/campusModel");
const LocationService = require("./locationService");

class CampusService {
    static async createCampus(campus) {
        // Check if the location exists
        const locationExists = await LocationService.getLocationByID(campus.locationID);
        if (!locationExists) {
            const error = new Error("Location does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            return CampusRepository.createCampus(campus);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getCampus(name) {
        try {
            return CampusRepository.getCampus(name);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getCampusByID(campusID) {
        try {
            return CampusRepository.getCampusByID(campusID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getAllCampuses() {
        try {
            return CampusRepository.getAllCampuses();
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async updateCampus(name, updates) {
        // Check if the location exists

        if (updates.locationID) {
            const locationExists = await LocationService.getLocationByID(updates.locationID);
            if (!locationExists) {
                const error = new Error("Location does not exist");
                error.statusCode = 404;
                throw error;
            }
        }
        try {
            return CampusRepository.updateCampus(name, updates);
        } catch (e) {
            throw new Error(e);
        }
    }

    static async deleteCampus(name) {
        try {
            return CampusRepository.deleteCampus(name);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteAllCampuses() {
        try {
            return CampusRepository.deleteAllCampuses();
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = CampusService;
