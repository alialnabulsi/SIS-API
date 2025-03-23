const Section = require("../models/sectionModel");
const database = require("../config/db");
require('dotenv').config();

class SectionRepository {

    static async createSection(section) {
        try {
            let sql = `INSERT INTO section 
            (courseID, scheduleID, instructorID, finalExamScheduleID, semesterID, sectionCapacity, enrolled, language)
            VALUES (?,?,?,?,?,?,?,?)`;
            const result = await database.query(sql, [
                section.courseID,
                section.scheduleID,
                section.instructorID,
                section.finalExamScheduleID,
                section.semesterID,
                section.sectionCapacity,
                section.enrolled,
                section.language
            ]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createSection:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getSection(sectionID) {
        if (!await this.sectionExists(sectionID)) {
            const error = new Error("Section does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM section WHERE sectionID = ?`;

            const [row] = await database.query(sql, [sectionID]);
            if (!row) {
                const error = new Error("Section does not exist");
                error.statusCode = 404;
                throw error;
            }

            return Section.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getSection:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllSections() {
        try {
            let sql = `SELECT * FROM section`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No sections exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Section.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllSections:", e);
            }
            throw e;
        }
    }

    static async updateSection(sectionID, updates) {
        if (!await this.sectionExists(sectionID)) {
            const error = new Error("Section does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE section SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE sectionID = ?";
            values.push(sectionID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateSection:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteSection(sectionID) {
        if (!await this.sectionExists(sectionID)) {
            const error = new Error("Section does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM section WHERE sectionID = ?`;
            const result = await database.query(sql, [sectionID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteSection:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllSections() {
        try {
            let sql = `DELETE FROM section`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No sections to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllSections:", e);
            }
            throw e;
        }
    }

    // Check if the section exists by ID
    static async sectionExists(sectionID) {
        try {
            let sql = `SELECT * FROM section WHERE sectionID = ?`;
            const rows = await database.query(sql, [sectionID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in sectionExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = SectionRepository;