const Department = require("../models/departmentModel");
const database = require("../config/db");
require('dotenv').config();

class DepartmentRepository {

    static async createDepartment(department) {
        try {
            let sql = `INSERT INTO department 
            (departmentID, facultyID, buildingID, name, establishedYear, contactEmail, contactPhone)
            VALUES (?,?,?,?,?,?,?)`;
            const result = await database.query(sql, [
                department.departmentID,
                department.facultyID,
                department.buildingID,
                department.name,
                department.establishedYear,
                department.contactEmail,
                department.contactPhone
            ]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createDepartment:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getDepartment(name) {
        if (!await this.departmentExists(name)) {
            const error = new Error("Department does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM department WHERE name = ?`;

            const [row] = await database.query(sql, [name]);
            if (!row) {
                const error = new Error("Department does not exist");
                error.statusCode = 404;
                throw error;
            }

            return Department.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getDepartmentByName:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getDepartmentByID(departmentID) {
        if (!await this.departmentExistsByID(departmentID)) {
            const error = new Error("Department does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM department WHERE departmentID = ?`;

            const [row] = await database.query(sql, [departmentID]);
            // no need to check row since it is checked in the departmentExists

            return Department.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getDepartmentByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllDepartments() {
        try {
            let sql = `SELECT * FROM department`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No departments exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Department.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllDepartments:", e);
            }
            throw e;
        }
    }

    static async updateDepartment(departmentID, updates) {
        if (!await this.departmentExistsByID(departmentID)) {
            const error = new Error("Department does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE department SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE departmentID = ?";
            values.push(departmentID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateDepartment:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteDepartment(name) {
        if (!await this.departmentExists(name)) {
            const error = new Error("Department does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM department WHERE name = ?`;
            const result = await database.query(sql, [name]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteDepartment:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllDepartments() {
        try {
            let sql = `DELETE FROM department`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No departments to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllDepartments:", e);
            }
            throw e;
        }
    }

    // Check if the department exists by departmentID
    static async departmentExistsByID(departmentID) {
        try {
            let sql = `SELECT * FROM department WHERE departmentID = ?`;
            const rows = await database.query(sql, [departmentID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in departmentExistsByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async departmentExists(name) {
        try {
            let sql = `SELECT * FROM department WHERE name = ?`;
            const rows = await database.query(sql, [name]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in departmentExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = DepartmentRepository;