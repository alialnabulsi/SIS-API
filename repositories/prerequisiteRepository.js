const Prerequisite = require("../models/prerequisiteModel");
const database = require("../config/db");
require('dotenv').config();

class PrerequisiteRepository {

    static async createPrerequisite(prerequisite) {
        if (await this.prerequisiteExistsByCourseAndPrerequisite(prerequisite.courseID, prerequisite.prerequisite)) {
            const error = new Error("Prerequisite already exists");
            error.statusCode = 409;
            throw error;
        }
        try {
            let sql = `INSERT INTO prerequisite 
            (courseID, prerequisiteID, prerequisiteType)
            VALUES (?, ?, ?)`;
            const result = await database.query(sql, [
                prerequisite.courseID,
                prerequisite.prerequisiteID,
                prerequisite.prerequisiteType
            ]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async getPrerequisite(prerequisiteCourseID) {
        if (!await this.prerequisiteExists(prerequisiteCourseID)) {
            const error = new Error("Prerequisite does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM prerequisite WHERE prerequisiteCourseID = ?`;

            const [row] = await database.query(sql, [prerequisiteCourseID]);
            return Prerequisite.fromRow(row);

        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async getPrerequisiteByCourseAndPrerequisite(courseID, prerequisiteID) {
        if (!await this.prerequisiteExistsByCourseAndPrerequisite(courseID, prerequisiteID)) {
            const error = new Error("Prerequisite does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM prerequisite WHERE courseID = ? AND prerequisiteID = ?`;

            const [row] = await database.query(sql, [courseID, prerequisiteID]);
            // no need to check row since it is checked in the prerequisiteExists

            return Prerequisite.fromRow(row);

        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllPrerequisites() {
        try {
            let sql = `SELECT * FROM prerequisite`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No prerequisites exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Prerequisite.fromRow);
        } catch (e) {
            throw e;
        }
    }

    static async updatePrerequisite(prerequisiteCourseID, updates) {
        if (!await this.prerequisiteExists(prerequisiteCourseID)) {
            const error = new Error("Prerequisite does not exist");
            error.statusCode = 404;
            error.courseNotFound = false;
            throw error;
        }
        if (!updates || Object.keys(updates).length === 0) {
            const error = new Error("No updates provided");
            error.statusCode = 400; 
            throw error;
        }
        if (updates.prerequisiteCourseID  && updates.prerequisiteCourseID !==prerequisiteCourseID) {
            if (await this.prerequisiteExists(updates.prerequisiteCourseID)) {
                const error = new Error("The new Prerequisite ID already exists");
                error.statusCode = 409;
                throw error;
            }
        }

        try {

            let sql = "UPDATE prerequisite SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE prerequisiteCourseID = ?";
            values.push(prerequisiteCourseID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async deletePrerequisite(prerequisiteCourseID) {
        if (!await this.prerequisiteExists(prerequisiteCourseID)) {
            const error = new Error("Prerequisite does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM prerequisite WHERE prerequisiteCourseID = ?`;
            const result = await database.query(sql, [prerequisiteCourseID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllPrerequisites() {
        try {
            let sql = `DELETE FROM prerequisite`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No prerequisites to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            throw e;
        }
    }

    // Check if the prerequisite exists by prerequisiteCourseID
    static async prerequisiteExists(prerequisiteCourseID) {
        try {
            let sql = `SELECT * FROM prerequisite WHERE prerequisiteCourseID = ?`;
            const rows = await database.query(sql, [prerequisiteCourseID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async prerequisiteExistsByCourseAndPrerequisite(courseID, prerequisiteID) {
        try {
            let sql = `SELECT * FROM prerequisite WHERE courseID = ? AND prerequisiteID = ?`;
            const rows = await database.query(sql, [courseID, prerequisiteID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = PrerequisiteRepository;