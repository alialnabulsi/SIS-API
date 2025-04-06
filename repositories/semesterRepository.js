const Semester = require("../models/semesterModel");
const database = require("../config/db");
require('dotenv').config();

class SemesterRepository {

    static async createSemester(semester) {
        if (await this.semesterExistsByNameAndYear(semester.name,semester.year)) {
            const error = new Error("Semester already exists");
            error.statusCode = 409;
            throw error;
        }
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

            return Semester.fromRow(row);

        } catch (e) {
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
            throw e;
        }
    }

    static async updateSemester(semesterID, updates) {
        if (!await this.semesterExists(semesterID)) {
            const error = new Error("Semester does not exist");
            error.statusCode = 404;
            throw error;
        }
        if (!updates || Object.keys(updates).length === 0) {
            const error = new Error("No updates provided");
            error.statusCode = 400; 
            throw error;
        }
        if (updates.semesterID  && updates.semesterID !== semesterID) {
            if (await this.semesterExists(updates.semesterID)) {
                const error = new Error("The new Semester ID already exists");
                error.statusCode = 409;
                throw error;
            }
        }


        try {

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
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = SemesterRepository;