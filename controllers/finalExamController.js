const FinalExam = require("../models/finalExamModel");
const FinalExamService = require("../services/finalExamService");

class FinalExamController {
    static async createFinalExam(req, res) {
        try {
            const { courseID } = req.body;
            const finalExam = new FinalExam(0, courseID);
            const result = await FinalExamService.createFinalExam(finalExam);
            res.status(201).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Course does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getFinalExam(req, res) {
        try {
            const { finalExamID } = req.params;
            const result = await FinalExamService.getFinalExam(finalExamID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'FinalExam not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getFinalExamByCourse(req, res) {
        try {
            const { courseID } = req.params;
            const result = await FinalExamService.getFinalExamByCourse(courseID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'FinalExam not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllFinalExams(req, res) {
        try {
            const result = await FinalExamService.getAllFinalExams();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No final_exams found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateFinalExam(req, res) {
        try {
            const { finalExamID } = req.params;
            const updates = req.body;
            const result = await FinalExamService.updateFinalExam(finalExamID, updates);
            res.status(204).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'FinalExam not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteFinalExam(req, res) {
        try {
            const { finalExamID } = req.params;
            const result = await FinalExamService.deleteFinalExam(finalExamID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'FinalExam not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllFinalExams(req, res) {
        try {
            const result = await FinalExamService.deleteAllFinalExams();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No final_exams found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = FinalExamController;