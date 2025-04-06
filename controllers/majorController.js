const Major = require("../models/majorModel");
const MajorService = require("../services/majorService");

class MajorController {
    static async createMajor(req, res) {
        try {
            const { departmentID, name } = req.body;
            const major = new Major(0, departmentID, name);
            const result = await MajorService.createMajor(major);
            res.status(201).json(result);
        } catch (e) {
            if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'Major already exists', error: e.message });
            } else
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Department does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getMajor(req, res) {
        try {
            const { name } = req.params;
            const result = await MajorService.getMajor(name);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Major not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getMajorByID(req, res) {
        try {
            const { majorID } = req.params;
            const result = await MajorService.getMajorByID(majorID);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Major not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllMajors(req, res) {
        try {
            const result = await MajorService.getAllMajors();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No majors found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateMajor(req, res) {
        try {
            const { majorID } = req.params;
            const updates = req.body;
            const result = await MajorService.updateMajor(majorID, updates);
            res.status(204).json(result);
        } catch (e) {
            if (e.statusCode === 400) {
                res.status(e.statusCode).json({ message: 'No updates provided', error: e.message });
            } else if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'The new Major ID already exists', error: e.message });
            } else
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Major not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteMajor(req, res) {
        try {
            const { name } = req.params;
            const result = await MajorService.deleteMajor(name);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Major not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllMajors(req, res) {
        try {
            const result = await MajorService.deleteAllMajors();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No majors found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = MajorController;