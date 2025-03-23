const FinalExamScheduleRepository = require("../repositories/finalExamScheduleRepository");
const FinalExamSchedule = require("../models/finalExamScheduleModel");
const FinalExamService = require("./finalExamService");
const ScheduleService = require("./scheduleService");

class FinalExamScheduleService {
    static async createFinalExamSchedule(finalExamSchedule) {
        try {
            // Check if the final exam exists
            const finalExamExists = await FinalExamService.getFinalExamByID(finalExamSchedule.finalExamID);
            if (!finalExamExists) {
                const error = new Error("Final Exam does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the schedule exists
            const scheduleExists = await ScheduleService.getScheduleByID(finalExamSchedule.scheduleID);
            if (!scheduleExists) {
                const error = new Error("Schedule does not exist");
                error.statusCode = 404;
                throw error;
            }

            return FinalExamScheduleRepository.createFinalExamSchedule(finalExamSchedule);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createFinalExamSchedule service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getFinalExamSchedule(finalExamScheduleID) {
        try {
            return FinalExamScheduleRepository.getFinalExamSchedule(finalExamScheduleID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getFinalExamSchedule service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllFinalExamSchedules() {
        try {
            return FinalExamScheduleRepository.getAllFinalExamSchedules();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllFinalExamSchedules service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateFinalExamSchedule(finalExamScheduleID, updates) {
        try {
            return FinalExamScheduleRepository.updateFinalExamSchedule(finalExamScheduleID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateFinalExamSchedule service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteFinalExamSchedule(finalExamScheduleID) {
        try {
            return FinalExamScheduleRepository.deleteFinalExamSchedule(finalExamScheduleID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteFinalExamSchedule service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllFinalExamSchedules() {
        try {
            return FinalExamScheduleRepository.deleteAllFinalExamSchedules();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllFinalExamSchedules service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = FinalExamScheduleService;