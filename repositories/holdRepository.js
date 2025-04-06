const Hold = require("../models/holdModel");
const database = require("../config/db");
require('dotenv').config();

class HoldRepository {

    static async createHold(hold) {
        if (await this.holdExistsByReason(hold.reason)) {
            const error = new Error("Hold already exist");
            error.statusCode = 409;
            throw error;
        }
        try {
            let sql = `INSERT INTO hold 
            (reason)
            VALUES (?)`;
            const result = await database.query(sql, [hold.reason]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
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
            throw new Error(e.sqlMessage);
        }
    }

    static async updateHold(holdID, updates) {
        if (!await this.holdExistsByID(holdID)) {
            const error = new Error("Hold does not exist");
            error.statusCode = 404;
            throw error;
        }
        if (!updates || Object.keys(updates).length === 0) {
            const error = new Error("No updates provided");
            error.statusCode = 400;
            throw error;
        }
        if (updates.holdID && updates.holdID !== holdID) {
            if (await this.holdExistsByID(updates.holdID)) {
                const error = new Error("The new Hold ID already exists");
                error.statusCode = 409;
                throw error;
            }
        }
        try {

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
            throw new Error(e.sqlMessage);
        }
    }

    // Check if a hold exists by its reason
    static async holdExistsByReason(reason) {
        try {
            let sql = `SELECT * FROM hold WHERE reason = ?`;
            const rows = await database.query(sql, [reason]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

}

module.exports = HoldRepository;