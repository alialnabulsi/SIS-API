const Campus = require("../models/campusModel");
const database = require("../config/db");
require('dotenv').config();

class CampusRepository {

    static async createCampus(campus) {
        if (await this.campusExists(campus.name)) {
            const error = new Error("Campus already exists");
            error.statusCode = 400;
            throw error;
        }

        try {
            let sql = `INSERT INTO campus (locationID, name) VALUES (?, ?)`;
            const result = await database.query(sql, [campus.locationID, campus.name]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString()
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createCampus:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getCampus(name) {
        if (!await this.campusExists(name)) {
            const error = new Error("Campus does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM campus WHERE name = ?`;
            const [row] = await database.query(sql, [name]);

            return Campus.fromRow(row);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getCampus:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllCampuses() {
        try {
            let sql = `SELECT * FROM campus`;
            const rows = await database.query(sql);

            if (!rows || rows.length === 0) {
                const error = new Error("No campuses exist");
                error.statusCode = 404;
                throw error;
            }

            return rows.map(Campus.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllCampuses:", e);
            }
            throw e;
        }
    }

    static async updateCampus(name, updates) {
        if (!await this.campusExists(name)) {
            const error = new Error("Campus does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE campus SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE name = ?";
            values.push(name);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateCampus:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteCampus(name) {
        if (!await this.campusExists(name)) {
            const error = new Error("Campus does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM campus WHERE name = ?`;
            const result = await database.query(sql, [name]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteCampus:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async campusExists(name) {
        try {
            let sql = `SELECT * FROM campus WHERE name = ?`;
            const rows = await database.query(sql, [name]);

            return rows && rows.length > 0;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in campusExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = CampusRepository;
