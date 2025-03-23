const Enrollment = require("../models/enrollmentModel");
const EnrollmentService = require("../services/enrollmentService");

class EnrollmentController {
    static async createEnrollment(req, res) {
        try {
            const { studentID, sectionID, courseID, status, enrollmentDate, grade } = req.body;
            const enrollment = new Enrollment(0, studentID, sectionID, courseID, status, enrollmentDate, grade);
            const result = await EnrollmentService.createEnrollment(enrollment);
            res.status(201).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'One or more foreign keys do not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getEnrollment(req, res) {
        try {
            const { enrollmentID } = req.params;
            const result = await EnrollmentService.getEnrollment(enrollmentID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Enrollment not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllEnrollments(req, res) {
        try {
            const result = await EnrollmentService.getAllEnrollments();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No enrollments found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateEnrollment(req, res) {
        try {
            const { enrollmentID } = req.params;
            const updates = req.body;
            const result = await EnrollmentService.updateEnrollment(enrollmentID, updates);
            res.status(204).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Enrollment not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteEnrollment(req, res) {
        try {
            const { enrollmentID } = req.params;
            const result = await EnrollmentService.deleteEnrollment(enrollmentID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Enrollment not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllEnrollments(req, res) {
        try {
            const result = await EnrollmentService.deleteAllEnrollments();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No enrollments found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = EnrollmentController;