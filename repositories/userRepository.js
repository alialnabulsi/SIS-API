const User = require("../models/userModel");
const database = require("../config/db");
require('dotenv').config();

class UserRepository {

    static async createUser(user) {
        try {
            let sql = `INSERT INTO user 
            (username, password, firstName, lastName, dateOfBirth, email, profilePicture, createdAt, updatedAt, lastLogin, city, zipCode, street)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            const result = await database.query(sql, [
                user.username,
                user.password,
                user.firstName,
                user.lastName,
                user.dateOfBirth,
                user.email,
                user.profilePicture,
                user.createdAt,
                user.updatedAt,
                user.lastLogin,
                user.city,
                user.zipCode,
                user.street
            ]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createUser:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getUser(username) {
        if (!await this.userExists(username)) {
            const error = new Error("User does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM user WHERE username = ?`;

            const [row] = await database.query(sql, [username]);
            if (!row) {
                const error = new Error("User does not exist");
                error.statusCode = 404;
                throw error;
            }

            return User.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getUserByUsername:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getUserByID(userID) {
        if (!await this.userExistsByID(userID)) {
            const error = new Error("User does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM user WHERE userID = ?`;

            const [row] = await database.query(sql, [userID]);
            // no need to check row since it is checked in the userExists

            return User.fromRow(row);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getUserByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllUsers() {
        try {
            let sql = `SELECT * FROM user`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No users exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(User.fromRow);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getAllUsers:", e);
            }
            throw e;
        }
    }

    static async updateUser(userID, updates) {
        if (!await this.userExistsByID(userID)) {
            const error = new Error("User does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }

            let sql = "UPDATE user SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE userID = ?";
            values.push(userID);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateUser:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteUser(username) {
        if (!await this.userExists(username)) {
            const error = new Error("User does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM user WHERE username = ?`;
            const result = await database.query(sql, [username]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteUser:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllUsers() {
        try {
            let sql = `DELETE FROM user`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No users to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllUsers:", e);
            }
            throw e;
        }
    }

    // Check if the user exists by userID
    static async userExistsByID(userID) {
        try {
            let sql = `SELECT * FROM user WHERE userID = ?`;
            const rows = await database.query(sql, [userID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in userExistsByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async userExists(username) {
        try {
            let sql = `SELECT * FROM user WHERE username = ?`;
            const rows = await database.query(sql, [username]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in userExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = UserRepository;