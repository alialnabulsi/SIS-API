const StudentHold = require("../models/studentHoldModel");
const StudentHoldService = require("../services/studentHoldService");

class StudentHoldController {
    static async createStudentHold(req, res) {
        try {
            const { studentID, holdID } = req.body;
            const studentHold = new StudentHold(0, studentID, holdID);
            const result = await StudentHoldService.createStudentHold(studentHold);
            res.status(201).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Student or Hold does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getStudentHold(req, res) {
        try {
            const { studentHoldID } = req.params;
            const result = await StudentHoldService.getStudentHold(studentHoldID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'StudentHold not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getStudentHoldByStudentAndHold(req, res) {
        try {
            const { studentID, holdID } = req.params;
            const result = await StudentHoldService.getStudentHoldByStudentAndHold(studentID, holdID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'StudentHold not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllStudentHolds(req, res) {
        try {
            const result = await StudentHoldService.getAllStudentHolds();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No student_holds found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateStudentHold(req, res) {
        try {
            const { studentHoldID } = req.params;
            const updates = req.body;
            const result = await StudentHoldService.updateStudentHold(studentHoldID, updates);
            res.status(204).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'StudentHold not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteStudentHold(req, res) {
        try {
            const { studentHoldID } = req.params;
            const result = await StudentHoldService.deleteStudentHold(studentHoldID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'StudentHold not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllStudentHolds(req, res) {
        try {
            const result = await StudentHoldService.deleteAllStudentHolds();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No student_holds found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = StudentHoldController;