const Instructor = require("../models/instructorModel");
const InstructorService = require("../services/instructorService");

class InstructorController {
    static async createInstructor(req, res) {
        try {
            const { userID, departmentID, hireDate } = req.body;
            const instructor = new Instructor(null, userID, departmentID, hireDate); // instructorID will be generated
            const result = await InstructorService.createInstructor(instructor);
            res.status(201).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'User or Department does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getInstructorByID(req, res) {
        try {
            const { instructorID } = req.params;
            const result = await InstructorService.getInstructorByID(instructorID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Instructor not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getInstructorByUserID(req, res) {
        try {
            const { userID } = req.params;
            const result = await InstructorService.getInstructorByUserID(userID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Instructor not found for this user', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getInstructorsByDepartmentID(req, res) {
        try {
            const { departmentID } = req.params;
            const result = await InstructorService.getInstructorsByDepartmentID(departmentID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No instructors found for this department', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateInstructor(req, res) {
        try {
            const { instructorID } = req.params;
            const updates = req.body;
            const result = await InstructorService.updateInstructor(instructorID, updates);
            res.status(204).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Instructor not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteInstructor(req, res) {
        try {
            const { instructorID } = req.params;
            const result = await InstructorService.deleteInstructor(instructorID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Instructor not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = InstructorController;