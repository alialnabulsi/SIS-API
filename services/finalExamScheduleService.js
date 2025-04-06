const FinalExamScheduleRepository = require("../repositories/finalExamScheduleRepository");
const FinalExamSchedule = require("../models/finalExamScheduleModel");
const FinalExamRepository = require("../repositories/finalExamRepository");
const ScheduleRepository = require("../repositories/scheduleRepository");

class FinalExamScheduleService {
    static async createFinalExamSchedule(finalExamSchedule) {
        // Check if the final exam exists
        const finalExamExists = await FinalExamRepository.finalExamExists(finalExamSchedule.finalExamID);
        if (!finalExamExists) {
            const error = new Error("Final Exam does not exist");
            error.statusCode = 404;
            throw error;
        }

        // Check if the schedule exists
        const scheduleExists = await ScheduleRepository.scheduleExists(finalExamSchedule.scheduleID);
        if (!scheduleExists) {
            const error = new Error("Schedule does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            
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
            throw new Error(e.message);
        }
    }

    static async getAllFinalExamSchedules() {
        try {
            return FinalExamScheduleRepository.getAllFinalExamSchedules();
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async updateFinalExamSchedule(finalExamScheduleID, updates) {
        if (updates.finalExamID) {
            const finalExamExists = await FinalExamRepository.finalExamExists(updates.finalExamID);
            if (!finalExamExists) {
                const error = new Error("Final Exam does not exist");
                error.statusCode = 404;
                error.finalExamNotFound = true;
                throw error;
            }
            const {scheduleID } = await FinalExamScheduleRepository.getFinalExamSchedule(finalExamScheduleID);
            const finalExamScheduleExists = await FinalExamScheduleRepository.finalExamScheduleExistsByExamAndSchedule(updates.finalExamID,scheduleID);
            if (finalExamScheduleExists) {
                const error = new Error("This Final Exam Schedule already exists");
                error.statusCode = 409;
                throw error;
            }
        }
        if (updates.scheduleID) {
            const scheduleExists = await ScheduleRepository.scheduleExists(updates.scheduleID);
            if (!scheduleExists) {
                const error = new Error("Schedule does not exist");
                error.statusCode = 404;
                error.finalExamNotFound = true;
                throw error;
            }
            const {finalExamID } = await FinalExamScheduleRepository.getFinalExamSchedule(finalExamScheduleID);
            const finalExamScheduleExists = await FinalExamScheduleRepository.finalExamScheduleExistsByExamAndSchedule(finalExamID,updates.scheduleID);

            if (finalExamScheduleExists) {
                const error = new Error("This Final Exam Schedule already exists");
                error.statusCode = 409;
                throw error;
            }
        }
        if (updates.finalExamID && updates.scheduleID) {
            const finalExamScheduleExists = await FinalExamScheduleRepository.finalExamScheduleExistsByExamAndSchedule(updates.finalExamID,updates.scheduleID);
            if (finalExamScheduleExists) {
                const error = new Error("This Final Exam Schedule already exists");
                error.statusCode = 409;
                throw error;
            }
        }
        try {
            return FinalExamScheduleRepository.updateFinalExamSchedule(finalExamScheduleID, updates);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteFinalExamSchedule(finalExamScheduleID) {
        try {
            return FinalExamScheduleRepository.deleteFinalExamSchedule(finalExamScheduleID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteAllFinalExamSchedules() {
        try {
            return FinalExamScheduleRepository.deleteAllFinalExamSchedules();
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = FinalExamScheduleService;