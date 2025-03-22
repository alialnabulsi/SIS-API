const Hold = require("../models/holdModel");
const database = require("../config/db");
require('dotenv').config();

class HoldRepository {

    static async createHold(hold) {
        try {
            let sql = `INSERT INTO hold 
            (studentID, semesterID, reason)
            VALUES (?,?,?)`;
            const result = await database.query(sql, [hold.studentID, hold.semesterID, hold.reason]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createHold:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getHoldByID(holdID) {
        if (!await this.holdExistsByID(holdID)) {
            const error = new Error("Hold does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM hold WHERE holdID = ?`;

            const [row] = await database.query(sql, [holdID]);
            // no need to check row since it is checked in the holdExists

            return Hold.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getHoldByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getHoldsByStudentID(studentID) {
        try {
            let sql = `SELECT * FROM hold WHERE studentID = ?`;
            const rows = await database.query(sql, [studentID]);
            if (!rows || rows.length === 0) {
                const error = new Error("No holds found for this student");
                error.statusCode = 404;
                throw error;
            }
            return rows.map(Hold.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getHoldsByStudentID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getHoldsBySemesterID(semesterID) {
        try {
            let sql = `SELECT * FROM hold WHERE semesterID = ?`;
            const rows = await database.query(sql, [semesterID]);
            if (!rows || rows.length === 0) {
                const error = new Error("No holds found for this semester");
                error.statusCode = 404;
                throw error;
            }
            return rows.map(Hold.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getHoldsBySemesterID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async updateHold(holdID, updates) {
        if (!await this.holdExistsByID(holdID)) {
            const error = new Error("Hold does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE hold SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE holdID = ?";
            values.push(holdID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateHold:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteHold(holdID) {
        if (!await this.holdExistsByID(holdID)) {
            const error = new Error("Hold does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM hold WHERE holdID = ?`;
            const result = await database.query(sql, [holdID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteHold:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllHoldsForStudent(studentID) {
        try {
            let sql = `DELETE FROM hold WHERE studentID = ?`;
            const result = await database.query(sql, [studentID]);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No holds found for this student");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllHoldsForStudent:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllHoldsForSemester(semesterID) {
        try {
            let sql = `DELETE FROM hold WHERE semesterID = ?`;
            const result = await database.query(sql, [semesterID]);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No holds found for this semester");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllHoldsForSemester:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    // Check if the hold exists by holdID
    static async holdExistsByID(holdID) {
        try {
            let sql = `SELECT * FROM hold WHERE holdID = ?`;
            const rows = await database.query(sql, [holdID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in holdExistsByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = HoldRepository;