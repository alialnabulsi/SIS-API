const Faculty = require("../models/facultyModel");
const database = require("../config/db");
require('dotenv').config();

class FacultyRepository {

    static async createFaculty(faculty) {
        if (await this.facultyExistsByID(faculty.facultyID)) {
            const error = new Error("Faculty already exists");
            error.statusCode = 409;
            throw error;
        }
        try {
            let sql = `INSERT INTO faculty 
            (facultyID, name)
            VALUES (?,?)`;
            const result = await database.query(sql, [faculty.facultyID, faculty.name]);
            const { affectedRows } = result;
            return {
                affectedRows,
            };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async getFaculty(name) {
        if (!await this.facultyExists(name)) {
            const error = new Error("Faculty does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM faculty WHERE name = ?`;

            const [row] = await database.query(sql, [name]);
            return Faculty.fromRow(row);

        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async getFacultyByID(facultyID) {
        if (!await this.facultyExistsByID(facultyID)) {
            const error = new Error("Faculty does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM faculty WHERE facultyID = ?`;

            const [row] = await database.query(sql, [facultyID]);
            // no need to check row since it is checked in the facultyExists

            return Faculty.fromRow(row);

        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllFaculties() {
        try {
            let sql = `SELECT * FROM faculty`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No faculties exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Faculty.fromRow);
        } catch (e) {
            throw e;
        }
    }

    static async updateFaculty(facultyID, updates) {
        if (!await this.facultyExistsByID(facultyID)) {
            const error = new Error("Faculty does not exist");
            error.statusCode = 404;
            throw error;
        }

        if (!updates || Object.keys(updates).length === 0) {
            const error = new Error("No updates provided");
            error.statusCode = 400; 
            throw error;
        }
        if (updates.facultyID  && updates.facultyID.toLowerCase() !== facultyID.toLowerCase()) {
            if (await this.facultyExistsByID(updates.facultyID)) {
                const error = new Error("The new faculty ID already exists");
                error.statusCode = 409;
                throw error;
            }
        }
        try {
            

            let sql = "UPDATE faculty SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE facultyID = ?";
            values.push(facultyID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteFaculty(name) {
        if (!await this.facultyExists(name)) {
            const error = new Error("Faculty does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM faculty WHERE name = ?`;
            const result = await database.query(sql, [name]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllFaculties() {
        try {
            let sql = `DELETE FROM faculty`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No faculties to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            throw e;
        }
    }

    // Check if the faculty exists by facultyID
    static async facultyExistsByID(facultyID) {
        try {
            let sql = `SELECT * FROM faculty WHERE facultyID = ?`;
            const rows = await database.query(sql, [facultyID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async facultyExists(name) {
        try {
            let sql = `SELECT * FROM faculty WHERE name = ?`;
            const rows = await database.query(sql, [name]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = FacultyRepository;