const Course = require("../models/courseModel");
const database = require("../config/db");
require('dotenv').config();

class CourseRepository {

    static async createCourse(course) {
        try {
            let sql = `INSERT INTO course 
            (courseID, name, credits)
            VALUES (?, ?, ?)`;
            const result = await database.query(sql, [
                course.courseID,
                course.name,
                course.credits
            ]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createCourse:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getCourse(courseID) {
        if (!await this.courseExists(courseID)) {
            const error = new Error("Course does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM course WHERE courseID = ?`;

            const [row] = await database.query(sql, [courseID]);
            if (!row) {
                const error = new Error("Course does not exist");
                error.statusCode = 404;
                throw error;
            }

            return Course.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getCourse:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getCourseByName(name) {
        if (!await this.courseExistsByName(name)) {
            const error = new Error("Course does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM course WHERE name = ?`;

            const [row] = await database.query(sql, [name]);
            // no need to check row since it is checked in the courseExists

            return Course.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getCourseByName:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllCourses() {
        try {
            let sql = `SELECT * FROM course`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No courses exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Course.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllCourses:", e);
            }
            throw e;
        }
    }

    static async updateCourse(courseID, updates) {
        if (!await this.courseExists(courseID)) {
            const error = new Error("Course does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE course SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE courseID = ?";
            values.push(courseID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateCourse:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteCourse(courseID) {
        if (!await this.courseExists(courseID)) {
            const error = new Error("Course does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM course WHERE courseID = ?`;
            const result = await database.query(sql, [courseID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteCourse:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllCourses() {
        try {
            let sql = `DELETE FROM course`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No courses to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllCourses:", e);
            }
            throw e;
        }
    }

    // Check if the course exists by courseID
    static async courseExists(courseID) {
        try {
            let sql = `SELECT * FROM course WHERE courseID = ?`;
            const rows = await database.query(sql, [courseID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in courseExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async courseExistsByName(name) {
        try {
            let sql = `SELECT * FROM course WHERE name = ?`;
            const rows = await database.query(sql, [name]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in courseExistsByName:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = CourseRepository;