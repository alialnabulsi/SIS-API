const Role = require("../models/roleModel");
const database = require("../config/db");
require('dotenv').config();

class RoleRepository {

    static async createRole(role) {
        try {
            let sql = `INSERT INTO role 
            (roleName, roleDescription)
            VALUES (?,?)`;
            const result = await database.query(sql, [role.roleName, role.roleDescription]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createRole:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getRole(roleName) {
        if (!await this.roleExists(roleName)) {
            const error = new Error("Role does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM role WHERE roleName = ?`;

            const [row] = await database.query(sql, [roleName]);
            if (!row) {
                const error = new Error("Role does not exist");
                error.statusCode = 404;
                throw error;
            }

            return Role.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getRoleByName:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getRoleByID(roleID) {
        if (!await this.roleExistsByID(roleID)) {
            const error = new Error("Role does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM role WHERE roleID = ?`;

            const [row] = await database.query(sql, [roleID]);
            // no need to check row since it is checked in the roleExists

            return Role.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getRoleByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllRoles() {
        try {
            let sql = `SELECT * FROM role`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No roles exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Role.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllRoles:", e);
            }
            throw e;
        }
    }

    static async updateRole(roleID, updates) {
        if (!await this.roleExistsByID(roleID)) {
            const error = new Error("Role does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE role SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE roleID = ?";
            values.push(roleID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateRole:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteRole(roleName) {
        if (!await this.roleExists(roleName)) {
            const error = new Error("Role does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM role WHERE roleName = ?`;
            const result = await database.query(sql, [roleName]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteRole:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllRoles() {
        try {
            let sql = `DELETE FROM role`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No roles to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllRoles:", e);
            }
            throw e;
        }
    }

    // Check if the role exists by roleID
    static async roleExistsByID(roleID) {
        try {
            let sql = `SELECT * FROM role WHERE roleID = ?`;
            const rows = await database.query(sql, [roleID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in roleExistsByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async roleExists(roleName) {
        try {
            let sql = `SELECT * FROM role WHERE roleName = ?`;
            const rows = await database.query(sql, [roleName]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in roleExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = RoleRepository;