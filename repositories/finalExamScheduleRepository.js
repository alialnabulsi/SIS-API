const FinalExamSchedule = require("../models/finalExamScheduleModel");
const database = require("../config/db");
require('dotenv').config();

class FinalExamScheduleRepository {

    static async createFinalExamSchedule(finalExamSchedule) {
        try {
            let sql = `INSERT INTO final_exam_schedule 
            (finalExamID, scheduleID)
            VALUES (?,?)`;
            const result = await database.query(sql, [finalExamSchedule.finalExamID, finalExamSchedule.scheduleID]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createFinalExamSchedule:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getFinalExamSchedule(finalExamScheduleID) {
        if (!await this.finalExamScheduleExists(finalExamScheduleID)) {
            const error = new Error("Final Exam Schedule does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM final_exam_schedule WHERE finalExamScheduleID = ?`;

            const [row] = await database.query(sql, [finalExamScheduleID]);
            if (!row) {
                const error = new Error("Final Exam Schedule does not exist");
                error.statusCode = 404;
                throw error;
            }

            return FinalExamSchedule.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getFinalExamSchedule:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllFinalExamSchedules() {
        try {
            let sql = `SELECT * FROM final_exam_schedule`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No final exam schedules exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(FinalExamSchedule.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllFinalExamSchedules:", e);
            }
            throw e;
        }
    }

    static async updateFinalExamSchedule(finalExamScheduleID, updates) {
        if (!await this.finalExamScheduleExists(finalExamScheduleID)) {
            const error = new Error("Final Exam Schedule does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE final_exam_schedule SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE finalExamScheduleID = ?";
            values.push(finalExamScheduleID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateFinalExamSchedule:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteFinalExamSchedule(finalExamScheduleID) {
        if (!await this.finalExamScheduleExists(finalExamScheduleID)) {
            const error = new Error("Final Exam Schedule does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM final_exam_schedule WHERE finalExamScheduleID = ?`;
            const result = await database.query(sql, [finalExamScheduleID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteFinalExamSchedule:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllFinalExamSchedules() {
        try {
            let sql = `DELETE FROM final_exam_schedule`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No final exam schedules to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllFinalExamSchedules:", e);
            }
            throw e;
        }
    }

    // Check if the final exam schedule exists by ID
    static async finalExamScheduleExists(finalExamScheduleID) {
        try {
            let sql = `SELECT * FROM final_exam_schedule WHERE finalExamScheduleID = ?`;
            const rows = await database.query(sql, [finalExamScheduleID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in finalExamScheduleExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = FinalExamScheduleRepository;