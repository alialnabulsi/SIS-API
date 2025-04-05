const ScheduleRepository = require("../repositories/scheduleRepository");
const Schedule = require("../models/scheduleModel");
const RoomRepository = require("../repositories/roomRepository");

class ScheduleService {
    static async createSchedule(schedule) {
        // Check if the room exists
        const roomExists = await RoomRepository.roomExistsByID(schedule.roomID);
        if (!roomExists) {
            const error = new Error("Room does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            return ScheduleRepository.createSchedule(schedule);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getSchedule(scheduleID) {
        try {
            return ScheduleRepository.getSchedule(scheduleID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getScheduleByRoomAndTime(roomID, startTime, endTime, day) {
        try {
            return ScheduleRepository.getScheduleByRoomAndTime(roomID, startTime, endTime, day);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getAllSchedules() {
        try {
            return ScheduleRepository.getAllSchedules();
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async updateSchedule(scheduleID, updates) {
        if (updates.roomID) {
            const roomExists = await RoomRepository.roomExistsByID(updates.roomID);
            
            if (!roomExists) {
                const error = new Error("Room does not exist");
                error.statusCode = 404;
                error.roomNotFound = true;
                throw error;
            }
        }
        try {
            return ScheduleRepository.updateSchedule(scheduleID, updates);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteSchedule(scheduleID) {
        try {
            return ScheduleRepository.deleteSchedule(scheduleID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteAllSchedules() {
        try {
            return ScheduleRepository.deleteAllSchedules();
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = ScheduleService;