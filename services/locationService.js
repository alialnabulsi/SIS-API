const LocationRepository = require("../repositories/locationRepository");
const Location = require("../models/locationModel");

class LocationService {
    static async createLocation(Location) {
        try {
            return LocationRepository.createLocation(Location);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createLocation service:", e);
            }  
            throw new Error(e.message || "An error occurred while creating the location.");
        }

    }
    static async getLocation(city) {
        try {
            return LocationRepository.getLocation(city);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getLocation service:", e);
            }  
            throw new Error(e.message || "An error occurred while fetching the location.");
        }
    }
    static async updateLocation(city, updates) {
        try {
            return locationRepository.updateLocation(city, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateLocation service:", e); 
            }
            throw new Error(e.message || "An error occurred while updating the location.");
        }
    }
}

module.exports=LocationService;
