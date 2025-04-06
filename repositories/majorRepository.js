const Major = require("../models/majorModel");
const database = require("../config/db");
require('dotenv').config();

class MajorRepository {

    static async createMajor(major) {
        if (await this.majorExists(major.name)) {
            const error = new Error("Major already exist");
            error.statusCode = 409;
            throw error;
        }
        try {
            let sql = `INSERT INTO major 
            (departmentID, name)
            VALUES (?, ?)`;
            const result = await database.query(sql, [major.departmentID, major.name]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async getMajor(name) {
        if (!await this.majorExists(name)) {
            const error = new Error("Major does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM major WHERE name = ?`;

            const [row] = await database.query(sql, [name]);

            return Major.fromRow(row);

        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async getMajorByID(majorID) {
        if (!await this.majorExistsByID(majorID)) {
            const error = new Error("Major does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM major WHERE majorID = ?`;

            const [row] = await database.query(sql, [majorID]);
            // no need to check row since it is checked in the majorExists

            return Major.fromRow(row);

        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllMajors() {
        try {
            let sql = `SELECT * FROM major`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No majors exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Major.fromRow);
        } catch (e) {
            throw e;
        }
    }

    static async updateMajor(majorID, updates) {
        if (!await this.majorExistsByID(majorID)) {
            const error = new Error("Major does not exist");
            error.statusCode = 404;
            error.departmentNotFound = false;
            throw error;
        }

        if (!updates || Object.keys(updates).length === 0) {
            const error = new Error("No updates provided");
            error.statusCode = 400; 
            throw error;
        }
        if (updates.majorID  && updates.majorID !== majorID) {
            if (await this.majorExistsByID(updates.majorID)) {
                const error = new Error("The new Major ID already exists");
                error.statusCode = 409;
                throw error;
            }
        }

        try {

            let sql = "UPDATE major SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE majorID = ?";
            values.push(majorID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteMajor(name) {
        if (!await this.majorExists(name)) {
            const error = new Error("Major does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM major WHERE name = ?`;
            const result = await database.query(sql, [name]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllMajors() {
        try {
            let sql = `DELETE FROM major`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No majors to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            throw e;
        }
    }

    // Check if the major exists by majorID
    static async majorExistsByID(majorID) {
        try {
            let sql = `SELECT * FROM major WHERE majorID = ?`;
            const rows = await database.query(sql, [majorID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async majorExists(name) {
        try {
            let sql = `SELECT * FROM major WHERE name = ?`;
            const rows = await database.query(sql, [name]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = MajorRepository;