const Admin = require("../models/adminModel");
const database = require("../config/db");
require('dotenv').config();

class AdminRepository {

    static async createAdmin(userID) {
        try {
            // Generate adminID: AD-YY-userID
            const year = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of the year
            const adminID = `AD-${year}-${userID}`;

            let sql = `INSERT INTO admin 
            (adminID, userID)
            VALUES (?,?)`;
            const result = await database.query(sql, [adminID, userID]);
            const { affectedRows } = result;
            return {
                affectedRows,
                adminID // Return the generated adminID
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createAdmin:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAdminByID(adminID) {
        if (!await this.adminExistsByID(adminID)) {
            const error = new Error("Admin does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM admin WHERE adminID = ?`;

            const [row] = await database.query(sql, [adminID]);
            // no need to check row since it is checked in the adminExists

            return Admin.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAdminByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAdminByUserID(userID) {
        try {
            let sql = `SELECT * FROM admin WHERE userID = ?`;

            const [row] = await database.query(sql, [userID]);
            if (!row) {
                const error = new Error("Admin does not exist for this user");
                error.statusCode = 404;
                throw error;
            }

            return Admin.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAdminByUserID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAdmin(adminID) {
        if (!await this.adminExistsByID(adminID)) {
            const error = new Error("Admin does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM admin WHERE adminID = ?`;
            const result = await database.query(sql, [adminID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAdmin:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    // Check if the admin exists by adminID
    static async adminExistsByID(adminID) {
        try {
            let sql = `SELECT * FROM admin WHERE adminID = ?`;
            const rows = await database.query(sql, [adminID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in adminExistsByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = AdminRepository;