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
            throw new Error(e.message);
        }

    }
    static async getLocation(city) {
        try {
            return LocationRepository.getLocation(city);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getLocation service:", e);
            }  
            throw new Error(e.message);
        }
    }

    static async getAllLocations() {
        try {
            return LocationRepository.getAllLocations();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllLocation service:", e);
            }  
            throw new Error(e.message);
        }
    }

    static async updateLocation(city, updates) {
        try {
            return LocationRepository.updateLocation(city, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateLocation service:", e); 
            }
            throw new Error(e.message);
        }
    }

    static async deleteLocation(city) {
        try {
            return LocationRepository.deleteLocation(city);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteLocation service:", e);
            }
            throw new Error(e.message);
        }
    }
    
}

module.exports=LocationService;
