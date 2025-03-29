const Campus = require("../models/campusModel");
const database = require("../config/db");
require('dotenv').config();

/*
In the table Campus in the database the name attribute is considered as unique key so each campus has a unique name.
*/

class CampusRepository {

    static async createCampus(campus) {
        if (await this.campusExists(campus.name)) {
            const error = new Error("Campus already exists");
            error.statusCode = 409;
            throw error;
        }
        try {
            let sql = `INSERT INTO campus 
            (locationID, name)
            VALUES (?,?)`;
            const result = await database.query(sql, [campus.locationID, campus.name]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
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
            // no need to check row since it is checked in the campusExists

            return Campus.fromRow(row);

        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async getCampusByID(campusID) {
        if (!await this.campusExistsByID(campusID)) {
            const error = new Error("Campus does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM campus WHERE campusID = ?`;

            const [row] = await database.query(sql, [campusID]);
            // no need to check row since it is checked in the campusExists

            return Campus.fromRow(row);

        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllCampuses() {
        try {
            let sql = `SELECT * FROM campus`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No campuses exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Campus.fromRow);
        } catch (e) {
            throw e; // since the throw of the error that contains the statusCode 404 inside the try, we should throw the error itself here, not a new one.
        }
    }

    static async updateCampus(name, updates) {
        if (!await this.campusExists(name)) {
            const error = new Error("Campus does not exist");
            error.statusCode = 404;
            throw error;
        }

        if (updates.name) {
            delete updates.city;
        }

        if (!updates || Object.keys(updates).length === 0) {
            const error = new Error("No updates provided");
            error.statusCode = 400; 
            throw error;
        }

        try {

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
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllCampuses() {
        try {
            let sql = `DELETE FROM campus`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No campuses to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            throw e;
        }
    }

    //for class use (non-member)
    static async campusExists(name) {
        try {
            let sql = `SELECT * FROM campus WHERE name = ?`;
            const rows = await database.query(sql, [name]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async campusExistsByID(campusID) {
        try {
            let sql = `SELECT * FROM campus WHERE campusID = ?`;
            const rows = await database.query(sql, [campusID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

}

module.exports = CampusRepository;
