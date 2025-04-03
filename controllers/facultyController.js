const Faculty = require("../models/facultyModel");
const FacultyService = require("../services/facultyService");

class FacultyController {
    static async createFaculty(req, res) {
        try {
            const { facultyID, name } = req.body;
            const faculty = new Faculty(facultyID, name);
            const result = await FacultyService.createFaculty(faculty);
            res.status(201).json(result);
        } catch (e) {
            if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'Faculty already exists', error: e.message });
            } else if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Faculty does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getFaculty(req, res) {
        try {
            const { name } = req.params;
            const result = await FacultyService.getFaculty(name);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Faculty not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getFacultyByID(req, res) {
        try {
            const { facultyID } = req.params;
            const result = await FacultyService.getFacultyByID(facultyID);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Faculty not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllFaculties(req, res) {
        try {
            const result = await FacultyService.getAllFaculties();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No faculties found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateFaculty(req, res) {
        try {
            const { facultyID } = req.params;
            const updates = req.body;
            const result = await FacultyService.updateFaculty(facultyID, updates);
            res.status(204).json(result);
        } catch (e) {
            if (e.statusCode === 400) {
                res.status(e.statusCode).json({ message: 'No updates provided', error: e.message });
            } else if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'The new Faculty name already exists', error: e.message });
            } else
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Faculty not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteFaculty(req, res) {
        try {
            const { name } = req.params;
            const result = await FacultyService.deleteFaculty(name);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Faculty not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllFaculties(req, res) {
        try {
            const result = await FacultyService.deleteAllFaculties();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No faculties found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = FacultyController;