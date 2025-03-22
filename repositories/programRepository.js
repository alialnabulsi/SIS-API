const Program = require("../models/programModel");
const database = require("../config/db");
require('dotenv').config();

class ProgramRepository {

    static async createProgram(program) {
        try {
            let sql = `INSERT INTO program 
            (majorID, minorID, name, programType, requirements)
            VALUES (?, ?, ?, ?, ?)`;
            const result = await database.query(sql, [
                program.majorID,
                program.minorID,
                program.name,
                program.programType,
                program.requirements
            ]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createProgram:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getProgram(name) {
        if (!await this.programExists(name)) {
            const error = new Error("Program does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM program WHERE name = ?`;

            const [row] = await database.query(sql, [name]);
            if (!row) {
                const error = new Error("Program does not exist");
                error.statusCode = 404;
                throw error;
            }

            return Program.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getProgramByName:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getProgramByID(programID) {
        if (!await this.programExistsByID(programID)) {
            const error = new Error("Program does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM program WHERE programID = ?`;

            const [row] = await database.query(sql, [programID]);
            // no need to check row since it is checked in the programExists

            return Program.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getProgram:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllPrograms() {
        try {
            let sql = `SELECT * FROM program`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No programs exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Program.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllPrograms:", e);
            }
            throw e;
        }
    }

    static async updateProgram(programID, updates) {
        if (!await this.programExistsByID(programID)) {
            const error = new Error("Program does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE program SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE programID = ?";
            values.push(programID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateProgram:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteProgram(name) {
        if (!await this.programExists(name)) {
            const error = new Error("Program does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM program WHERE name = ?`;
            const result = await database.query(sql, [name]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteProgram:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllPrograms() {
        try {
            let sql = `DELETE FROM program`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No programs to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllPrograms:", e);
            }
            throw e;
        }
    }

    // Check if the program exists by programID
    static async programExistsByID(programID) {
        try {
            let sql = `SELECT * FROM program WHERE programID = ?`;
            const rows = await database.query(sql, [programID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in programExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async programExists(name) {
        try {
            let sql = `SELECT * FROM program WHERE name = ?`;
            const rows = await database.query(sql, [name]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in programExistsByName:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = ProgramRepository;