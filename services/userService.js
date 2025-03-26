const UserRepository = require("../repositories/userRepository");
const User = require("../models/userModel");

class UserService {
    static async createUser(user) {
        try {
            return UserRepository.createUser(user);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createUser service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getUser(username) {
        try {
            return UserRepository.getUser(username);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getUser service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getUserByID(userID) {
        try {
            return UserRepository.getUserByID(userID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getUserByID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllUsers() {
        try {
            return UserRepository.getAllUsers();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllUsers service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateUser(userID, updates) {
        try {
            return UserRepository.updateUser(userID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateUser service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteUser(username) {
        try {
            return UserRepository.deleteUser(username);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteUser service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllUsers() {
        try {
            return UserRepository.deleteAllUsers();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllUsers service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = UserService;