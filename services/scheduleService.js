const ScheduleRepository = require("../repositories/scheduleRepository");
const Schedule = require("../models/scheduleModel");
const RoomService = require("./roomService");

class ScheduleService {
    static async createSchedule(schedule) {
        try {
            // Check if the room exists
            const roomExists = await RoomService.getRoomByID(schedule.roomID);
            if (!roomExists) {
                const error = new Error("Room does not exist");
                error.statusCode = 404;
                throw error;
            }

            return ScheduleRepository.createSchedule(schedule);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createSchedule service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getSchedule(scheduleID) {
        try {
            return ScheduleRepository.getSchedule(scheduleID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getSchedule service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getScheduleByRoomAndTime(roomID, startTime, endTime, day) {
        try {
            return ScheduleRepository.getScheduleByRoomAndTime(roomID, startTime, endTime, day);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getScheduleByRoomAndTime service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllSchedules() {
        try {
            return ScheduleRepository.getAllSchedules();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllSchedules service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateSchedule(scheduleID, updates) {
        try {
            return ScheduleRepository.updateSchedule(scheduleID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateSchedule service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteSchedule(scheduleID) {
        try {
            return ScheduleRepository.deleteSchedule(scheduleID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteSchedule service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllSchedules() {
        try {
            return ScheduleRepository.deleteAllSchedules();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllSchedules service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = ScheduleService;