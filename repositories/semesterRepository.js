const Semester = require("../models/semesterModel");
const database = require("../config/db");
require('dotenv').config();

class SemesterRepository {

    static async createSemester(semester) {
        try {
            let sql = `INSERT INTO semester 
            (name, year)
            VALUES (?, ?)`;
            const result = await database.query(sql, [
                semester.name,
                semester.year
            ]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                semesterID: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createSemester:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getSemester(semesterID) {
        if (!await this.semesterExists(semesterID)) {
            const error = new Error("Semester does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM semester WHERE semesterID = ?`;

            const [row] = await database.query(sql, [semesterID]);
            if (!row) {
                const error = new Error("Semester does not exist");
                error.statusCode = 404;
                throw error;
            }

            return Semester.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getSemester:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getSemesterByNameAndYear(name, year) {
        if (!await this.semesterExistsByNameAndYear(name, year)) {
            const error = new Error("Semester does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM semester WHERE name = ? AND year = ?`;

            const [row] = await database.query(sql, [name, year]);
            // no need to check row since it is checked in the semesterExists

            return Semester.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getSemesterByNameAndYear:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllSemesters() {
        try {
            let sql = `SELECT * FROM semester`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No semesters exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Semester.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllSemesters:", e);
            }
            throw e;
        }
    }

    static async updateSemester(semesterID, updates) {
        if (!await this.semesterExists(semesterID)) {
            const error = new Error("Semester does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE semester SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE semesterID = ?";
            values.push(semesterID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateSemester:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteSemester(semesterID) {
        if (!await this.semesterExists(semesterID)) {
            const error = new Error("Semester does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM semester WHERE semesterID = ?`;
            const result = await database.query(sql, [semesterID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteSemester:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllSemesters() {
        try {
            let sql = `DELETE FROM semester`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No semesters to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllSemesters:", e);
            }
            throw e;
        }
    }

    // Check if the semester exists by semesterID
    static async semesterExists(semesterID) {
        try {
            let sql = `SELECT * FROM semester WHERE semesterID = ?`;
            const rows = await database.query(sql, [semesterID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in semesterExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async semesterExistsByNameAndYear(name, year) {
        try {
            let sql = `SELECT * FROM semester WHERE name = ? AND year = ?`;
            const rows = await database.query(sql, [name, year]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in semesterExistsByNameAndYear:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = SemesterRepository;