const Building = require("../models/buildingModel");
const database = require("../config/db");
require('dotenv').config();

/*
In the table Building, campusID is a foreign key, linking each building to a specific campus.
*/

class BuildingRepository {

    static async createBuilding(building) {
        try {
            let sql = `INSERT INTO building 
            (campusID, name, numberOfFloors)
            VALUES (?,?,?)`;
            const result = await database.query(sql, [building.campusID, building.name, building.numberOfFloors]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createBuilding:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getBuilding(name) {
        if (!await this.buildingExists(name)) {
            const error = new Error("Building does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM building WHERE name = ?`;

            const [row] = await database.query(sql, [name]);
            if (!row) {
                const error = new Error("Building does not exist");
                error.statusCode = 404;
                throw error;
            }

            return Building.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getBuildingByName:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getBuildingByID(buildingID) {
        if (!await this.buildingExistsByID(buildingID)) {
            const error = new Error("Building does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM building WHERE buildingID = ?`;

            const [row] = await database.query(sql, [buildingID]);
            // no need to check row since it is checked in the buildingExists

            return Building.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getBuilding:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllBuildings() {
        try {
            let sql = `SELECT * FROM building`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No buildings exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Building.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllBuildings:", e);
            }
            throw e;
        }
    }

    static async updateBuilding(buildingID, updates) {
        if (!await this.buildingExistsByID(buildingID)) {
            const error = new Error("Building does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE building SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE buildingID = ?";
            values.push(buildingID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateBuilding:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteBuilding(name) {
        if (!await this.buildingExists(name)) {
            const error = new Error("Building does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM building WHERE name = ?`;
            const result = await database.query(sql, [name]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteBuilding:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllBuildings() {
        try {
            let sql = `DELETE FROM building`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No buildings to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllBuildings:", e);
            }
            throw e;
        }
    }

    // Check if the building exists by buildingID
    static async buildingExistsByID(buildingID) {
        try {
            let sql = `SELECT * FROM building WHERE buildingID = ?`;
            const rows = await database.query(sql, [buildingID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in buildingExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async buildingExists(name) {
        try {
            let sql = `SELECT * FROM building WHERE name = ?`;
            const rows = await database.query(sql, [name]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in buildingExistsByName:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = BuildingRepository;
