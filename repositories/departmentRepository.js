const Department = require("../models/departmentModel");
const database = require("../config/db");
require('dotenv').config();

class DepartmentRepository {

    static async createDepartment(department) {
        if (await this.departmentExists(department.name)) {
            const error = new Error("Department already exists");
            error.statusCode = 409;
            throw error;
        }
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
            const { affectedRows } = result;
            return {
                affectedRows,
            };
        } catch (e) {
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
            return Department.fromRow(row);

        } catch (e) {
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
            throw e;
        }
    }

    static async updateDepartment(departmentID, updates) {
        if (!await this.departmentExistsByID(departmentID)) {
            const error = new Error("Department does not exist");
            error.statusCode = 404;
            throw error;
        }

        if (!updates || Object.keys(updates).length === 0) {
            const error = new Error("No updates provided");
            error.statusCode = 400; 
            throw error;
        }
        if (updates.departmentID  && updates.departmentID.toLowerCase() !== departmentID.toLowerCase()) {
            if (await this.departmentExistsByID(updates.departmentID)) {
                const error = new Error("The new Department ID already exists");
                error.statusCode = 409;
                throw error;
            }
        }
        try {
            

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
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = DepartmentRepository;