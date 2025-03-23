const StudentHold = require("../models/studentHoldModel");
const database = require("../config/db");
require('dotenv').config();

class StudentHoldRepository {

    static async createStudentHold(studentHold) {
        try {
            let sql = `INSERT INTO student_hold 
            (studentID, holdID)
            VALUES (?, ?)`;
            const result = await database.query(sql, [
                studentHold.studentID,
                studentHold.holdID
            ]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                studentHoldID: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createStudentHold:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getStudentHold(studentHoldID) {
        if (!await this.studentHoldExists(studentHoldID)) {
            const error = new Error("StudentHold does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM student_hold WHERE studentHoldID = ?`;

            const [row] = await database.query(sql, [studentHoldID]);
            if (!row) {
                const error = new Error("StudentHold does not exist");
                error.statusCode = 404;
                throw error;
            }

            return StudentHold.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getStudentHold:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getStudentHoldByStudentAndHold(studentID, holdID) {
        if (!await this.studentHoldExistsByStudentAndHold(studentID, holdID)) {
            const error = new Error("StudentHold does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM student_hold WHERE studentID = ? AND holdID = ?`;

            const [row] = await database.query(sql, [studentID, holdID]);
            // no need to check row since it is checked in the studentHoldExists

            return StudentHold.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getStudentHoldByStudentAndHold:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllStudentHolds() {
        try {
            let sql = `SELECT * FROM student_hold`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No student_holds exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(StudentHold.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllStudentHolds:", e);
            }
            throw e;
        }
    }

    static async updateStudentHold(studentHoldID, updates) {
        if (!await this.studentHoldExists(studentHoldID)) {
            const error = new Error("StudentHold does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE student_hold SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE studentHoldID = ?";
            values.push(studentHoldID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateStudentHold:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteStudentHold(studentHoldID) {
        if (!await this.studentHoldExists(studentHoldID)) {
            const error = new Error("StudentHold does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM student_hold WHERE studentHoldID = ?`;
            const result = await database.query(sql, [studentHoldID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteStudentHold:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllStudentHolds() {
        try {
            let sql = `DELETE FROM student_hold`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No student_holds to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllStudentHolds:", e);
            }
            throw e;
        }
    }

    // Check if the studentHold exists by studentHoldID
    static async studentHoldExists(studentHoldID) {
        try {
            let sql = `SELECT * FROM student_hold WHERE studentHoldID = ?`;
            const rows = await database.query(sql, [studentHoldID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in studentHoldExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async studentHoldExistsByStudentAndHold(studentID, holdID) {
        try {
            let sql = `SELECT * FROM student_hold WHERE studentID = ? AND holdID = ?`;
            const rows = await database.query(sql, [studentID, holdID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in studentHoldExistsByStudentAndHold:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = StudentHoldRepository;