const Minor = require("../models/minorModel");
const database = require("../config/db");
require('dotenv').config();

class MinorRepository {

    static async createMinor(minor) {
        try {
            let sql = `INSERT INTO minor 
            (departmentID, name)
            VALUES (?, ?)`;
            const result = await database.query(sql, [minor.departmentID, minor.name]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createMinor:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getMinor(name) {
        if (!await this.minorExists(name)) {
            const error = new Error("Minor does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM minor WHERE name = ?`;

            const [row] = await database.query(sql, [name]);
            if (!row) {
                const error = new Error("Minor does not exist");
                error.statusCode = 404;
                throw error;
            }

            return Minor.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getMinorByName:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getMinorByID(minorID) {
        if (!await this.minorExistsByID(minorID)) {
            const error = new Error("Minor does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM minor WHERE minorID = ?`;

            const [row] = await database.query(sql, [minorID]);
            // no need to check row since it is checked in the minorExists

            return Minor.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getMinor:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllMinors() {
        try {
            let sql = `SELECT * FROM minor`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No minors exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Minor.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllMinors:", e);
            }
            throw e;
        }
    }

    static async updateMinor(minorID, updates) {
        if (!await this.minorExistsByID(minorID)) {
            const error = new Error("Minor does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE minor SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE minorID = ?";
            values.push(minorID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateMinor:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteMinor(name) {
        if (!await this.minorExists(name)) {
            const error = new Error("Minor does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM minor WHERE name = ?`;
            const result = await database.query(sql, [name]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteMinor:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllMinors() {
        try {
            let sql = `DELETE FROM minor`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No minors to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllMinors:", e);
            }
            throw e;
        }
    }

    // Check if the minor exists by minorID
    static async minorExistsByID(minorID) {
        try {
            let sql = `SELECT * FROM minor WHERE minorID = ?`;
            const rows = await database.query(sql, [minorID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in minorExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async minorExists(name) {
        try {
            let sql = `SELECT * FROM minor WHERE name = ?`;
            const rows = await database.query(sql, [name]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in minorExistsByName:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = MinorRepository;