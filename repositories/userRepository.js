const User = require("../models/userModel");
const database = require("../config/db");
require('dotenv').config();

class UserRepository {

    static async createUser(user) {
        if (await this.userExists(user.username)) {
            const error = new Error("User already exist");
            error.statusCode = 409;
            error.usernameExists=false;

            throw error;
        }
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
            throw new Error(e.sqlMessage);
        }
    }
    //no route for this
    static async getUserByEmail(email) {
        if (!await this.emailExists(email)) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM user WHERE email = ?`;
            const [row] = await database.query(sql, [email]);
            return User.fromRow(row);
        } catch (e) {
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
            throw e;
        }
    }

    static async updateUser(userID, updates) {
        if (!await this.userExistsByID(userID)) {
            const error = new Error("User does not exist");
            error.statusCode = 404;
            throw error;
        }
        if (!updates || Object.keys(updates).length === 0) {
            const error = new Error("No updates provided");
            error.statusCode = 400;
            throw error;
        }
        if (updates.userID && updates.userID !== userID) {
            if (await this.userExistsByID(updates.userID)) {
                const error = new Error("The new User ID already exists");
                error.statusCode = 409;
                throw error;
            }
        }

        try {

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
            throw e;
        }
    }


    static async updatePassword(userID, newPassword) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            const sql = `UPDATE user SET password = ? WHERE userID = ?`;
            const result = await database.query(sql, [hashedPassword, userID]);
            return { affectedRows: result.affectedRows };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async lockAccount(userID) {
        try {
            const sql = `UPDATE user SET isLocked = true WHERE userID = ?`;
            const result = await database.query(sql, [userID]);
            return { affectedRows: result.affectedRows };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async unlockAccount(userID) {
        try {
            const sql = `UPDATE user SET isLocked = false, loginAttempts = 0 WHERE userID = ?`;
            const result = await database.query(sql, [userID]);
            return { affectedRows: result.affectedRows };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async searchUsers(searchTerm) {
        try {
            let sql = `
            SELECT * FROM user 
            WHERE username LIKE ? 
            OR firstName LIKE ? 
            OR lastName LIKE ? 
            OR email LIKE ?
        `;
            const searchParam = `%${searchTerm}%`;
            const rows = await database.query(sql, [searchParam, searchParam, searchParam, searchParam]);
            return rows.map(User.fromRow);
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async validateCredentials(email, password) {
        try {
            let sql = `SELECT * FROM user WHERE email = ?`;
            const [row] = await database.query(sql, [email]);

            if (!row) {
                const error = new Error("Invalid credentials");
                error.statusCode = 401;
                error.email = email;
                throw error;
            }

            const user = User.fromRow(row);

            const isValid = await user.validatePassword(password);

            if (!isValid) {
                const error = new Error("Invalid credentials");
                error.statusCode = 401;
                error.email = email;

                throw error;
            }

            return user;
        } catch (e) {
            throw e;
        }
    }

    static async setLastLogin(userID) {
        try {
            const sql = `UPDATE user SET lastLogin = NOW() WHERE userID = ?`;
            await database.query(sql, [userID]);
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async incrementLoginAttempts(userID) {
        try {
            const sql = `UPDATE user SET loginAttempts = loginAttempts + 1 WHERE userID = ?`;
            await database.query(sql, [userID]);
        } catch (e) {
            throw new Error(e.sqlMessage);
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
            throw new Error(e.sqlMessage);
        }
    }

    static async emailExists(email) {
        try {
            let sql = `SELECT * FROM user WHERE email = ?`;
            const rows = await database.query(sql, [email]);
    
            if (rows && rows.length > 0) {
                return true;
            }
    
            return false;
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = UserRepository;