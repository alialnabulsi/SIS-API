const Campus = require("../models/campusModel");
const CampusService = require("../services/campusService");

class CampusController {
    static async createCampus(req, res) {
        try {
            const { locationID, name } = req.body;
            const campus = new Campus(0, locationID, name);
            const result = await CampusService.createCampus(campus);
            res.status(201).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 400) {
                res.status(e.statusCode).json({ message: 'Location does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getCampus(req, res) {
        try {
            const { name } = req.params;
            const result = await CampusService.getCampus(name);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Campus not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getCampusByID(req, res) {
        try {
            const { campusID } = req.params;
            const result = await CampusService.getCampusByID(campusID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Campus not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllCampuses(req, res) {
        try {
            const result = await CampusService.getAllCampuses();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No campuses found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateCampus(req, res) {
        try {
            const { name } = req.params;
            const updates = req.body;
            const result = await CampusService.updateCampus(name, updates);
            res.status(204).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Campus not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteCampus(req, res) {
        try {
            const { name } = req.params;
            const result = await CampusService.deleteCampus(name);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Campus not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllCampuses(req, res) {
        try {
            const result = await CampusService.deleteAllCampuses();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No campuses found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = CampusController;
