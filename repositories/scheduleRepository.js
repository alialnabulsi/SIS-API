const Schedule = require("../models/scheduleModel");
const database = require("../config/db");
require('dotenv').config();

class ScheduleRepository {

    static async createSchedule(schedule) {
        if (await this.scheduleExistsByRoomAndTime(schedule.roomID, schedule.startTime, schedule.endTime, schedule.day)) {
            const error = new Error("Schedule already exists");
            error.statusCode = 409;
            throw error;
        }
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
            return Schedule.fromRow(row);

        } catch (e) {
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
            throw e;
        }
    }

    static async updateSchedule(scheduleID, updates) {
        if (!await this.scheduleExists(scheduleID)) {
            const error = new Error("Schedule does not exist");
            error.statusCode = 404;
            error.roomNotFound = false;
            throw error;
        }
        if (!updates || Object.keys(updates).length === 0) {
            const error = new Error("No updates provided");
            error.statusCode = 400; 
            throw error;
        }
        if (updates.scheduleID  && updates.scheduleID !== scheduleID) {
            if (await this.scheduleExists(updates.scheduleID)) {
                const error = new Error("The new schedule ID already exists");
                error.statusCode = 409;
                throw error;
            }
        }

        try {
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
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = ScheduleRepository;