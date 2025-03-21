const Location = require("../models/locationModel");
const LocationService = require("../services/locationService");

class LocationController {
    static async createLocation(req, res) {
        try {
            const {city, zipCode, address} = req.body;
            const location = new Location(0,city, zipCode, address);
            const result = await LocationService.createLocation(location);
            res.status(201).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            res.status(e.statusCode || 500).json({ message: 'Internal server error', error: e.message });
        }
    }

    static async getLocation(req,res){
        try{
            const {city} = req.params;
            const result =  await LocationService.getLocation(city);
            res.status(200).json(result);
        }catch(e){
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            res.status(e.statusCode || 500).json({ message: 'Internal server error', error: e.message });
        }
    }

    static async updateLocation(req,res){
        try{
            const {city} = req.params;
            const updates = req.body;

            const result = await LocationService.updateLocation(city,updates);

            res.status(201).json(result);
        }catch(e){
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            res.status(500).json({ message: 'Internal server error' , error: e.message});
        }
    }
}

module.exports = LocationController;