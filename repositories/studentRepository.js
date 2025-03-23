const Student = require("../models/studentModel");
const database = require("../config/db");
require('dotenv').config();

class StudentRepository {

    static async createStudent(student) {
        try {
            // Generate studentID: ST-YY-userID
            const user = await database.query(`SELECT createdAt FROM user WHERE userID = ?`, [student.userID]);
            if (!user || user.length === 0) {
                throw new Error("User does not exist");
            }
            const year = new Date(user[0].createdAt).getFullYear().toString().slice(-2); // Extract last 2 digits of the year
            const studentID = `ST-${year}-${student.userID}`;

            let sql = `INSERT INTO student 
            (studentID, userID, advisorID, programID, status, admissionYear)
            VALUES (?, ?, ?, ?, ?, ?)`;
            const result = await database.query(sql, [
                studentID,
                student.userID,
                student.advisorID,
                student.programID,
                student.status,
                student.admissionYear
            ]);
            const { affectedRows } = result;
            return {
                affectedRows,
                studentID
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createStudent:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getStudent(studentID) {
        if (!await this.studentExists(studentID)) {
            const error = new Error("Student does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM student WHERE studentID = ?`;

            const [row] = await database.query(sql, [studentID]);
            if (!row) {
                const error = new Error("Student does not exist");
                error.statusCode = 404;
                throw error;
            }

            return Student.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getStudent:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getStudentByUserID(userID) {
        if (!await this.studentExistsByUserID(userID)) {
            const error = new Error("Student does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM student WHERE userID = ?`;

            const [row] = await database.query(sql, [userID]);
            // no need to check row since it is checked in the studentExists

            return Student.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getStudentByUserID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllStudents() {
        try {
            let sql = `SELECT * FROM student`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No students exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Student.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllStudents:", e);
            }
            throw e;
        }
    }

    static async updateStudent(studentID, updates) {
        if (!await this.studentExists(studentID)) {
            const error = new Error("Student does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE student SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE studentID = ?";
            values.push(studentID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateStudent:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteStudent(studentID) {
        if (!await this.studentExists(studentID)) {
            const error = new Error("Student does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM student WHERE studentID = ?`;
            const result = await database.query(sql, [studentID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteStudent:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllStudents() {
        try {
            let sql = `DELETE FROM student`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No students to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllStudents:", e);
            }
            throw e;
        }
    }

    // Check if the student exists by studentID
    static async studentExists(studentID) {
        try {
            let sql = `SELECT * FROM student WHERE studentID = ?`;
            const rows = await database.query(sql, [studentID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in studentExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async studentExistsByUserID(userID) {
        try {
            let sql = `SELECT * FROM student WHERE userID = ?`;
            const rows = await database.query(sql, [userID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in studentExistsByUserID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = StudentRepository;