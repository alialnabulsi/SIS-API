const CampusRepository = require("../repositories/campusRepository");
const LocationRepository = require("../repositories/locationRepository");

class CampusService {
    static async createCampus(campus) {
        try {
            // Ensure the associated location exists before creating the campus
            const locationExists = await LocationRepository.locationExists(campus.city);
            if (!locationExists) {
                throw new Error("Location does not exist");
            }
            return CampusRepository.createCampus(campus);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createCampus service:", e);
            }  
            throw new Error(e.message);
        }
    }

    static async getCampus(name) {
        try {
            return CampusRepository.getCampus(name);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getCampus service:", e);
            }  
            throw new Error(e.message);
        }
    }

    static async getAllCampuses() {
        try {
            return CampusRepository.getAllCampuses();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllCampuses service:", e);
            }  
            throw new Error(e.message);
        }
    }

    static async updateCampus(name, updates) {
        try {
            return CampusRepository.updateCampus(name, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateCampus service:", e); 
            }
            throw new Error(e.message);
        }
    }

    static async deleteCampus(name) {
        try {
            return CampusRepository.deleteCampus(name);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteCampus service:", e);
            }
            throw new Error(e.message);
        }
    }
    
    static async deleteAllCampuses() {
        try {
            return CampusRepository.deleteAllCampuses();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllCampuses service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = CampusService;
