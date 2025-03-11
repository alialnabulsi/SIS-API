const locationRepository = require("../repositories/locationRepository");
const Location = require("../models/locationModel.js");

class locationService {
    static async createLocation(Location) {
        try {
            return locationRepository.createLocation(Location);
        } catch (e) {
            console.error("Error in createLocation service:", e);  
            throw new Error(e.message || "An error occurred while creating the location.");
        }

    }
    static async getLocation(city) {
        try {
            return locationRepository.getLocation(city);
        } catch (e) {
            console.error("Error in getLocation service:", e);  
            throw new Error(e.message || "An error occurred while fetching the location.");
        }
    }
    static async updateLocation(city, updates) {
        try {
            return locationRepository.updateLocation(city, updates);
        } catch (e) {
            console.error("Error in updateLocation service:", e); 
            throw new Error(e.message || "An error occurred while updating the location.");
        }
    }
}

module.exports=locationService;
