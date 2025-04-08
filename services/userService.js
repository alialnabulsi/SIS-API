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
}

module.exports = UserService;