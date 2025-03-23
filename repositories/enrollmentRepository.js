const Enrollment = require("../models/enrollmentModel");
const database = require("../config/db");
require('dotenv').config();

class EnrollmentRepository {

    static async createEnrollment(enrollment) {
        try {
            let sql = `INSERT INTO enrollment 
            (studentID, sectionID, courseID, status, enrollmentDate, grade)
            VALUES (?,?,?,?,?,?)`;
            const result = await database.query(sql, [
                enrollment.studentID,
                enrollment.sectionID,
                enrollment.courseID,
                enrollment.status,
                enrollment.enrollmentDate,
                enrollment.grade
            ]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createEnrollment:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getEnrollment(enrollmentID) {
        if (!await this.enrollmentExists(enrollmentID)) {
            const error = new Error("Enrollment does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM enrollment WHERE enrollmentID = ?`;

            const [row] = await database.query(sql, [enrollmentID]);
            if (!row) {
                const error = new Error("Enrollment does not exist");
                error.statusCode = 404;
                throw error;
            }

            return Enrollment.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getEnrollment:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllEnrollments() {
        try {
            let sql = `SELECT * FROM enrollment`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No enrollments exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Enrollment.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllEnrollments:", e);
            }
            throw e;
        }
    }

    static async updateEnrollment(enrollmentID, updates) {
        if (!await this.enrollmentExists(enrollmentID)) {
            const error = new Error("Enrollment does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE enrollment SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE enrollmentID = ?";
            values.push(enrollmentID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateEnrollment:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteEnrollment(enrollmentID) {
        if (!await this.enrollmentExists(enrollmentID)) {
            const error = new Error("Enrollment does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM enrollment WHERE enrollmentID = ?`;
            const result = await database.query(sql, [enrollmentID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteEnrollment:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllEnrollments() {
        try {
            let sql = `DELETE FROM enrollment`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No enrollments to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllEnrollments:", e);
            }
            throw e;
        }
    }

    // Check if the enrollment exists by ID
    static async enrollmentExists(enrollmentID) {
        try {
            let sql = `SELECT * FROM enrollment WHERE enrollmentID = ?`;
            const rows = await database.query(sql, [enrollmentID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in enrollmentExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = EnrollmentRepository;