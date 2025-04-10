const UserRepository = require("../repositories/userRepository");
const User = require("../models/userModel");

class UserService {
    static async createUser(user) {
        try {
            return UserRepository.createUser(user);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getUser(username) {
        try {
            return UserRepository.getUser(username);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getUserByID(userID) {
        try {
            return UserRepository.getUserByID(userID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getAllUsers() {
        try {
            return UserRepository.getAllUsers();
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async updateUser(userID, updates) {
        if (updates.username) {
            const usernameExists = await UserRepository.userExists(updates.username);
            
            if (usernameExists) {
                const error = new Error("User already exist");
                error.statusCode = 409;
                error.usernameExists=true;
                throw error;
            }
        }
        try {
            return UserRepository.updateUser(userID, updates);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteUser(username) {
        try {
            return UserRepository.deleteUser(username);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteAllUsers() {
        try {
            return UserRepository.deleteAllUsers();
        } catch (e) {
            throw new Error(e.message);
        }
    }


    static async loginUser(userID) {
        try {
            await UserRepository.setLastLogin(userID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async updatePassword(userID, newPassword) {
        try {
            return await UserRepository.updatePassword(userID, newPassword);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async lockAccount(userID) {
        try {
            return await UserRepository.lockAccount(userID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async unlockAccount(userID) {
        try {
            return await UserRepository.unlockAccount(userID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async searchUsers(searchTerm) {
        try {
            return await UserRepository.searchUsers(searchTerm);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async validateCredentials(email, password) {
        try {
            return await UserRepository.validateCredentials(email, password);
        } catch (e) {

            throw e;
        }
    }
}

module.exports = UserService;