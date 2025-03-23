const FinalExamSchedule = require("../models/finalExamScheduleModel");
const FinalExamScheduleService = require("../services/finalExamScheduleService");

class FinalExamScheduleController {
    static async createFinalExamSchedule(req, res) {
        try {
            const { finalExamID, scheduleID } = req.body;
            const finalExamSchedule = new FinalExamSchedule(0, finalExamID, scheduleID);
            const result = await FinalExamScheduleService.createFinalExamSchedule(finalExamSchedule);
            res.status(201).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Final Exam or Schedule does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getFinalExamSchedule(req, res) {
        try {
            const { finalExamScheduleID } = req.params;
            const result = await FinalExamScheduleService.getFinalExamSchedule(finalExamScheduleID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Final Exam Schedule not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllFinalExamSchedules(req, res) {
        try {
            const result = await FinalExamScheduleService.getAllFinalExamSchedules();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No final exam schedules found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateFinalExamSchedule(req, res) {
        try {
            const { finalExamScheduleID } = req.params;
            const updates = req.body;
            const result = await FinalExamScheduleService.updateFinalExamSchedule(finalExamScheduleID, updates);
            res.status(204).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Final Exam Schedule not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteFinalExamSchedule(req, res) {
        try {
            const { finalExamScheduleID } = req.params;
            const result = await FinalExamScheduleService.deleteFinalExamSchedule(finalExamScheduleID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Final Exam Schedule not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllFinalExamSchedules(req, res) {
        try {
            const result = await FinalExamScheduleService.deleteAllFinalExamSchedules();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No final exam schedules found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = FinalExamScheduleController;