const Schedule = require("../models/scheduleModel");
const database = require("../config/db");
require('dotenv').config();

class ScheduleRepository {

    static async createSchedule(schedule) {
        try {
            let sql = `INSERT INTO schedule 
            (roomID, startTime, endTime, day, scheduleType)
            VALUES (?, ?, ?, ?, ?)`;
            const result = await database.query(sql, [
                schedule.roomID,
                schedule.startTime,
                schedule.endTime,
                schedule.day,
                schedule.scheduleType
            ]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                scheduleID: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createSchedule:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getSchedule(scheduleID) {
        if (!await this.scheduleExists(scheduleID)) {
            const error = new Error("Schedule does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM schedule WHERE scheduleID = ?`;

            const [row] = await database.query(sql, [scheduleID]);
            if (!row) {
                const error = new Error("Schedule does not exist");
                error.statusCode = 404;
                throw error;
            }

            return Schedule.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getSchedule:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getScheduleByRoomAndTime(roomID, startTime, endTime, day) {
        if (!await this.scheduleExistsByRoomAndTime(roomID, startTime, endTime, day)) {
            const error = new Error("Schedule does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM schedule WHERE roomID = ? AND startTime = ? AND endTime = ? AND day = ?`;

            const [row] = await database.query(sql, [roomID, startTime, endTime, day]);
            // no need to check row since it is checked in the scheduleExists

            return Schedule.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getScheduleByRoomAndTime:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllSchedules() {
        try {
            let sql = `SELECT * FROM schedule`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No schedules exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Schedule.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllSchedules:", e);
            }
            throw e;
        }
    }

    static async updateSchedule(scheduleID, updates) {
        if (!await this.scheduleExists(scheduleID)) {
            const error = new Error("Schedule does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE schedule SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE scheduleID = ?";
            values.push(scheduleID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateSchedule:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteSchedule(scheduleID) {
        if (!await this.scheduleExists(scheduleID)) {
            const error = new Error("Schedule does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM schedule WHERE scheduleID = ?`;
            const result = await database.query(sql, [scheduleID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteSchedule:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllSchedules() {
        try {
            let sql = `DELETE FROM schedule`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No schedules to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllSchedules:", e);
            }
            throw e;
        }
    }

    // Check if the schedule exists by scheduleID
    static async scheduleExists(scheduleID) {
        try {
            let sql = `SELECT * FROM schedule WHERE scheduleID = ?`;
            const rows = await database.query(sql, [scheduleID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in scheduleExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async scheduleExistsByRoomAndTime(roomID, startTime, endTime, day) {
        try {
            let sql = `SELECT * FROM schedule WHERE roomID = ? AND startTime = ? AND endTime = ? AND day = ?`;
            const rows = await database.query(sql, [roomID, startTime, endTime, day]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in scheduleExistsByRoomAndTime:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = ScheduleRepository;