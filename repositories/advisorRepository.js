const Advisor = require("../models/advisorModel");
const database = require("../config/db");
require('dotenv').config();

class AdvisorRepository {

    static async createAdvisor(advisor) {
        try {
            // Generate advisorID: AD-YY-userID
            const year = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of the year
            const advisorID = `AD-${year}-${advisor.userID}`;

            let sql = `INSERT INTO advisor 
            (advisorID, userID, departmentID)
            VALUES (?,?,?)`;
            const result = await database.query(sql, [advisorID, advisor.userID, advisor.departmentID]);
            const { affectedRows } = result;
            return {
                affectedRows,
                advisorID // Return the generated advisorID
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createAdvisor:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAdvisorByID(advisorID) {
        if (!await this.advisorExistsByID(advisorID)) {
            const error = new Error("Advisor does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM advisor WHERE advisorID = ?`;

            const [row] = await database.query(sql, [advisorID]);
            // no need to check row since it is checked in the advisorExists

            return Advisor.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAdvisorByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAdvisorByUserID(userID) {
        try {
            let sql = `SELECT * FROM advisor WHERE userID = ?`;

            const [row] = await database.query(sql, [userID]);
            if (!row) {
                const error = new Error("Advisor does not exist for this user");
                error.statusCode = 404;
                throw error;
            }

            return Advisor.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAdvisorByUserID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAdvisorsByDepartmentID(departmentID) {
        try {
            let sql = `SELECT * FROM advisor WHERE departmentID = ?`;
            const rows = await database.query(sql, [departmentID]);
            if (!rows || rows.length === 0) {
                const error = new Error("No advisors found for this department");
                error.statusCode = 404;
                throw error;
            }
            return rows.map(Advisor.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAdvisorsByDepartmentID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async updateAdvisor(advisorID, updates) {
        if (!await this.advisorExistsByID(advisorID)) {
            const error = new Error("Advisor does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE advisor SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE advisorID = ?";
            values.push(advisorID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateAdvisor:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAdvisor(advisorID) {
        if (!await this.advisorExistsByID(advisorID)) {
            const error = new Error("Advisor does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM advisor WHERE advisorID = ?`;
            const result = await database.query(sql, [advisorID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAdvisor:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllAdvisors() {
        try {
            let sql = `DELETE FROM advisor`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No advisors to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllAdvisors:", e);
            }
            throw e;
        }
    }

    // Check if the advisor exists by advisorID
    static async advisorExistsByID(advisorID) {
        try {
            let sql = `SELECT * FROM advisor WHERE advisorID = ?`;
            const rows = await database.query(sql, [advisorID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in advisorExistsByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = AdvisorRepository;