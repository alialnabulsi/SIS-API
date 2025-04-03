const UserRole = require("../models/userRoleModel");
const database = require("../config/db");
require('dotenv').config();

class UserRoleRepository {

    static async createUserRole(userRole) {
        try {
            let sql = `INSERT INTO user_role 
            (userID, roleID)
            VALUES (?,?)`;
            const result = await database.query(sql, [userRole.userID, userRole.roleID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createUserRole:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getUserRolesByUserID(userID) {
        try {
            let sql = `SELECT * FROM user_role WHERE userID = ?`;
            const rows = await database.query(sql, [userID]);
            if (!rows || rows.length === 0) {
                const error = new Error("No roles found for this user");
                error.statusCode = 404;
                throw error;
            }
            return rows.map(UserRole.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getUserRolesByUserID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getUserRolesByRoleID(roleID) {
        try {
            let sql = `SELECT * FROM user_role WHERE roleID = ?`;
            const rows = await database.query(sql, [roleID]);
            if (!rows || rows.length === 0) {
                const error = new Error("No users found for this role");
                error.statusCode = 404;
                throw error;
            }
            return rows.map(UserRole.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getUserRolesByRoleID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }


    static async getAllUserRoles() {
        try {
            let sql = `SELECT * FROM user_role`;
            const rows = await database.query(sql);
            if (!rows || rows.length === 0) {
                const error = new Error("No user-role relationships exist");
                error.statusCode = 404;
                throw error;
            }
            return rows.map(UserRole.fromRow);
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async updateUserRole(userID, roleID, newRoleID) {
        if (!await this.userRoleExists(userID, roleID)) {
            const error = new Error("User-Role relationship does not exist");
            error.statusCode = 404;
            throw error;
        }

        if (await this.userRoleExists(userID, newRoleID)) {
            const error = new Error("New User-Role relationship already exists");
            error.statusCode = 409;
            throw error;
        }

        try {
            let sql = `UPDATE user_role SET roleID = ? WHERE userID = ? AND roleID = ?`;
            const result = await database.query(sql, [newRoleID, userID, roleID]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllUserRoles() {
        try {
            let sql = `DELETE FROM user_role`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No user-role relationships to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async userRoleExistsByID(userID, roleID) {
        try {
            let sql = `SELECT * FROM user_role WHERE userID = ? AND roleID = ?`;
            const rows = await database.query(sql, [userID, roleID]);
            return rows && rows.length > 0;
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteUserRole(userID, roleID) {
        try {
            let sql = `DELETE FROM user_role WHERE userID = ? AND roleID = ?`;
            const result = await database.query(sql, [userID, roleID]);
            const { affectedRows } = result;
            if (affectedRows === 0) {
                const error = new Error("User-Role relationship does not exist");
                error.statusCode = 404;
                throw error;
            }
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteUserRole:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllRolesForUser(userID) {
        try {
            let sql = `DELETE FROM user_role WHERE userID = ?`;
            const result = await database.query(sql, [userID]);
            const { affectedRows } = result;
            if (affectedRows === 0) {
                const error = new Error("No roles found for this user");
                error.statusCode = 404;
                throw error;
            }
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllRolesForUser:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllUsersForRole(roleID) {
        try {
            let sql = `DELETE FROM user_role WHERE roleID = ?`;
            const result = await database.query(sql, [roleID]);
            const { affectedRows } = result;
            if (affectedRows === 0) {
                const error = new Error("No users found for this role");
                error.statusCode = 404;
                throw error;
            }
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllUsersForRole:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async userRoleExists(userID, roleID) {
        try {
            let sql = `SELECT * FROM user_role WHERE userID = ? AND roleID = ?`;
            const rows = await database.query(sql, [userID, roleID]);
            return rows && rows.length > 0;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in userRoleExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = UserRoleRepository;