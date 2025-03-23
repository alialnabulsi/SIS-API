const FinalExam = require("../models/finalExamModel");
const database = require("../config/db");
require('dotenv').config();

class FinalExamRepository {

    static async createFinalExam(finalExam) {
        try {
            let sql = `INSERT INTO final_exam 
            (courseID)
            VALUES (?)`;
            const result = await database.query(sql, [
                finalExam.courseID
            ]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                finalExamID: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createFinalExam:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getFinalExam(finalExamID) {
        if (!await this.finalExamExists(finalExamID)) {
            const error = new Error("FinalExam does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM final_exam WHERE finalExamID = ?`;

            const [row] = await database.query(sql, [finalExamID]);
            if (!row) {
                const error = new Error("FinalExam does not exist");
                error.statusCode = 404;
                throw error;
            }

            return FinalExam.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getFinalExam:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getFinalExamByCourse(courseID) {
        if (!await this.finalExamExistsByCourse(courseID)) {
            const error = new Error("FinalExam does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM final_exam WHERE courseID = ?`;

            const [row] = await database.query(sql, [courseID]);
            // no need to check row since it is checked in the finalExamExists

            return FinalExam.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getFinalExamByCourse:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllFinalExams() {
        try {
            let sql = `SELECT * FROM final_exam`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No final_exams exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(FinalExam.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllFinalExams:", e);
            }
            throw e;
        }
    }

    static async updateFinalExam(finalExamID, updates) {
        if (!await this.finalExamExists(finalExamID)) {
            const error = new Error("FinalExam does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE final_exam SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE finalExamID = ?";
            values.push(finalExamID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateFinalExam:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteFinalExam(finalExamID) {
        if (!await this.finalExamExists(finalExamID)) {
            const error = new Error("FinalExam does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM final_exam WHERE finalExamID = ?`;
            const result = await database.query(sql, [finalExamID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteFinalExam:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllFinalExams() {
        try {
            let sql = `DELETE FROM final_exam`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No final_exams to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllFinalExams:", e);
            }
            throw e;
        }
    }

    // Check if the finalExam exists by finalExamID
    static async finalExamExists(finalExamID) {
        try {
            let sql = `SELECT * FROM final_exam WHERE finalExamID = ?`;
            const rows = await database.query(sql, [finalExamID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in finalExamExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async finalExamExistsByCourse(courseID) {
        try {
            let sql = `SELECT * FROM final_exam WHERE courseID = ?`;
            const rows = await database.query(sql, [courseID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in finalExamExistsByCourse:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = FinalExamRepository;