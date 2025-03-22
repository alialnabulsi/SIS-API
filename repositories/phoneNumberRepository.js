const PhoneNumber = require("../models/phoneNumberModel");
const database = require("../config/db");
require('dotenv').config();

class PhoneNumberRepository {

    static async createPhoneNumber(phoneNumber) {
        try {
            let sql = `INSERT INTO phone_number 
            (userID, phoneNumber)
            VALUES (?,?)`;
            const result = await database.query(sql, [phoneNumber.userID, phoneNumber.phoneNumber]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createPhoneNumber:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getPhoneNumber(phoneNumber) {
        if (!await this.phoneNumberExists(phoneNumber)) {
            const error = new Error("Phone number does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM phone_number WHERE phoneNumber = ?`;

            const [row] = await database.query(sql, [phoneNumber]);
            if (!row) {
                const error = new Error("Phone number does not exist");
                error.statusCode = 404;
                throw error;
            }

            return PhoneNumber.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getPhoneNumber:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getPhoneNumberByID(phoneNumberID) {
        if (!await this.phoneNumberExistsByID(phoneNumberID)) {
            const error = new Error("Phone number does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM phone_number WHERE phoneNumberID = ?`;

            const [row] = await database.query(sql, [phoneNumberID]);
            // no need to check row since it is checked in the phoneNumberExists

            return PhoneNumber.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getPhoneNumberByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllPhoneNumbers() {
        try {
            let sql = `SELECT * FROM phone_number`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No phone numbers exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(PhoneNumber.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllPhoneNumbers:", e);
            }
            throw e;
        }
    }

    static async updatePhoneNumber(phoneNumberID, updates) {
        if (!await this.phoneNumberExistsByID(phoneNumberID)) {
            const error = new Error("Phone number does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE phone_number SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE phoneNumberID = ?";
            values.push(phoneNumberID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updatePhoneNumber:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deletePhoneNumber(phoneNumber) {
        if (!await this.phoneNumberExists(phoneNumber)) {
            const error = new Error("Phone number does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM phone_number WHERE phoneNumber = ?`;
            const result = await database.query(sql, [phoneNumber]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deletePhoneNumber:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllPhoneNumbers() {
        try {
            let sql = `DELETE FROM phone_number`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No phone numbers to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllPhoneNumbers:", e);
            }
            throw e;
        }
    }

    // Check if the phone number exists by phoneNumberID
    static async phoneNumberExistsByID(phoneNumberID) {
        try {
            let sql = `SELECT * FROM phone_number WHERE phoneNumberID = ?`;
            const rows = await database.query(sql, [phoneNumberID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in phoneNumberExistsByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async phoneNumberExists(phoneNumber) {
        try {
            let sql = `SELECT * FROM phone_number WHERE phoneNumber = ?`;
            const rows = await database.query(sql, [phoneNumber]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in phoneNumberExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = PhoneNumberRepository;