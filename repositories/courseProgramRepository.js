const CourseProgram = require("../models/courseProgramModel");
const database = require("../config/db");
require('dotenv').config();

class CourseProgramRepository {

    static async createCourseProgram(courseProgram) {
        try {
            let sql = `INSERT INTO course_program 
            (courseID, programID)
            VALUES (?, ?)`;
            const result = await database.query(sql, [
                courseProgram.courseID,
                courseProgram.programID
            ]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createCourseProgram:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getCourseProgram(courseProgramID) {
        if (!await this.courseProgramExists(courseProgramID)) {
            const error = new Error("CourseProgram does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM course_program WHERE courseProgramID = ?`;

            const [row] = await database.query(sql, [courseProgramID]);
            if (!row) {
                const error = new Error("CourseProgram does not exist");
                error.statusCode = 404;
                throw error;
            }

            return CourseProgram.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getCourseProgram:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getCourseProgramByCourseAndProgram(courseID, programID) {
        if (!await this.courseProgramExistsByCourseAndProgram(courseID, programID)) {
            const error = new Error("CourseProgram does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM course_program WHERE courseID = ? AND programID = ?`;

            const [row] = await database.query(sql, [courseID, programID]);
            // no need to check row since it is checked in the courseProgramExists

            return CourseProgram.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getCourseProgramByCourseAndProgram:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllCoursePrograms() {
        try {
            let sql = `SELECT * FROM course_program`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No course_programs exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(CourseProgram.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllCoursePrograms:", e);
            }
            throw e;
        }
    }

    static async updateCourseProgram(courseProgramID, updates) {
        if (!await this.courseProgramExists(courseProgramID)) {
            const error = new Error("CourseProgram does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE course_program SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE courseProgramID = ?";
            values.push(courseProgramID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateCourseProgram:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteCourseProgram(courseProgramID) {
        if (!await this.courseProgramExists(courseProgramID)) {
            const error = new Error("CourseProgram does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM course_program WHERE courseProgramID = ?`;
            const result = await database.query(sql, [courseProgramID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteCourseProgram:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllCoursePrograms() {
        try {
            let sql = `DELETE FROM course_program`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No course_programs to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllCoursePrograms:", e);
            }
            throw e;
        }
    }

    // Check if the courseProgram exists by courseProgramID
    static async courseProgramExists(courseProgramID) {
        try {
            let sql = `SELECT * FROM course_program WHERE courseProgramID = ?`;
            const rows = await database.query(sql, [courseProgramID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in courseProgramExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async courseProgramExistsByCourseAndProgram(courseID, programID) {
        try {
            let sql = `SELECT * FROM course_program WHERE courseID = ? AND programID = ?`;
            const rows = await database.query(sql, [courseID, programID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in courseProgramExistsByCourseAndProgram:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = CourseProgramRepository;