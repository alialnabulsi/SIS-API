const AdminRepository = require("../repositories/adminRepository");
const Admin = require("../models/adminModel");
const UserService = require("./userService");

class AdminService {
    static async createAdmin(userID) {
        try {
            // Check if the user exists
            const userExists = await UserService.getUserByID(userID);
            if (!userExists) {
                const error = new Error("User does not exist");
                error.statusCode = 404;
                throw error;
            }

            return AdminRepository.createAdmin(userID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createAdmin service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAdminByID(adminID) {
        try {
            return AdminRepository.getAdminByID(adminID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAdminByID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAdminByUserID(userID) {
        try {
            return AdminRepository.getAdminByUserID(userID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAdminByUserID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAdmin(adminID) {
        try {
            return AdminRepository.deleteAdmin(adminID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAdmin service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = AdminService;