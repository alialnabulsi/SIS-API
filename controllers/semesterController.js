const Semester = require("../models/semesterModel");
const SemesterService = require("../services/semesterService");

class SemesterController {
    static async createSemester(req, res) {
        try {
            const { name, year } = req.body;
            const semester = new Semester(0, name, year);
            const result = await SemesterService.createSemester(semester);
            res.status(201).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            res.status(500).json({ message: 'Internal server error', error: e.message });
        }
    }

    static async getSemester(req, res) {
        try {
            const { semesterID } = req.params;
            const result = await SemesterService.getSemester(semesterID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Semester not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getSemesterByNameAndYear(req, res) {
        try {
            const { name, year } = req.params;
            const result = await SemesterService.getSemesterByNameAndYear(name, year);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Semester not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllSemesters(req, res) {
        try {
            const result = await SemesterService.getAllSemesters();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No semesters found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateSemester(req, res) {
        try {
            const { semesterID } = req.params;
            const updates = req.body;
            const result = await SemesterService.updateSemester(semesterID, updates);
            res.status(204).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Semester not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteSemester(req, res) {
        try {
            const { semesterID } = req.params;
            const result = await SemesterService.deleteSemester(semesterID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Semester not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllSemesters(req, res) {
        try {
            const result = await SemesterService.deleteAllSemesters();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No semesters found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = SemesterController;