const Instructor = require("../models/instructorModel");
const database = require("../config/db");
require('dotenv').config();

class InstructorRepository {

    static async createInstructor(instructor) {
        try {
            // Generate instructorID: IN-YY-userID
            const year = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of the year
            const instructorID = `IN-${year}-${instructor.userID}`;

            let sql = `INSERT INTO instructor 
            (instructorID, userID, departmentID, hireDate)
            VALUES (?,?,?,?)`;
            const result = await database.query(sql, [instructorID, instructor.userID, instructor.departmentID, instructor.hireDate]);
            const { affectedRows } = result;
            return {
                affectedRows,
                instructorID // Return the generated instructorID
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createInstructor:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getInstructorByID(instructorID) {
        if (!await this.instructorExistsByID(instructorID)) {
            const error = new Error("Instructor does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM instructor WHERE instructorID = ?`;

            const [row] = await database.query(sql, [instructorID]);
            // no need to check row since it is checked in the instructorExists

            return Instructor.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getInstructorByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getInstructorByUserID(userID) {
        try {
            let sql = `SELECT * FROM instructor WHERE userID = ?`;

            const [row] = await database.query(sql, [userID]);
            if (!row) {
                const error = new Error("Instructor does not exist for this user");
                error.statusCode = 404;
                throw error;
            }

            return Instructor.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getInstructorByUserID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getInstructorsByDepartmentID(departmentID) {
        try {
            let sql = `SELECT * FROM instructor WHERE departmentID = ?`;
            const rows = await database.query(sql, [departmentID]);
            if (!rows || rows.length === 0) {
                const error = new Error("No instructors found for this department");
                error.statusCode = 404;
                throw error;
            }
            return rows.map(Instructor.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getInstructorsByDepartmentID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async updateInstructor(instructorID, updates) {
        if (!await this.instructorExistsByID(instructorID)) {
            const error = new Error("Instructor does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE instructor SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE instructorID = ?";
            values.push(instructorID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateInstructor:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteInstructor(instructorID) {
        if (!await this.instructorExistsByID(instructorID)) {
            const error = new Error("Instructor does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM instructor WHERE instructorID = ?`;
            const result = await database.query(sql, [instructorID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteInstructor:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    // Check if the instructor exists by instructorID
    static async instructorExistsByID(instructorID) {
        try {
            let sql = `SELECT * FROM instructor WHERE instructorID = ?`;
            const rows = await database.query(sql, [instructorID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in instructorExistsByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = InstructorRepository;