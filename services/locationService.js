const LocationRepository = require("../repositories/locationRepository");
const Location = require("../models/locationModel");

class LocationService {
    static async createLocation(Location) {
        try {
            return LocationRepository.createLocation(Location);
        } catch (e) { 
            throw new Error(e.message);
        }

    }
    static async getLocation(city) {
        try {
            return LocationRepository.getLocation(city);
        } catch (e) { 
            throw new Error(e.message);
        }
    }

    static async getLocationByID(locationID) {
        try {
            return LocationRepository.getLocationByID(locationID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getAllLocations() {
        try {
            return LocationRepository.getAllLocations();
        } catch (e) { 
            throw new Error(e.message);
        }
    }

    static async updateLocation(city, updates) {
        try {
            return LocationRepository.updateLocation(city, updates);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteLocation(city) {
        try {
            return LocationRepository.deleteLocation(city);
        } catch (e) {
            throw new Error(e.message);
        }
    }
    
    static async deleteAllLocations() {
        try {
            return LocationRepository.deleteAllLocations();
        } catch (e) {
            throw new Error(e.message);
        }
    }
    
}

module.exports=LocationService;
