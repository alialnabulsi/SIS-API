const UserRoleRepository = require("../repositories/userRoleRepository");
const UserRole = require("../models/userRoleModel");
const UserService = require("./userService");
const RoleService = require("./roleService");

class UserRoleService {
    static async createUserRole(userRole) {
        try {
            // Check if the user exists
            const userExists = await UserService.getUserByID(userRole.userID);
            if (!userExists) {
                const error = new Error("User does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the role exists
            const roleExists = await RoleService.getRoleByID(userRole.roleID);
            if (!roleExists) {
                const error = new Error("Role does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the user-role relationship already exists
            const userRoleExists = await UserRoleRepository.userRoleExists(userRole.userID, userRole.roleID);
            if (userRoleExists) {
                const error = new Error("User-Role relationship already exists");
                error.statusCode = 400;
                throw error;
            }

            return UserRoleRepository.createUserRole(userRole);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createUserRole service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getUserRolesByUserID(userID) {
        try {
            return UserRoleRepository.getUserRolesByUserID(userID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getUserRolesByUserID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getUserRolesByRoleID(roleID) {
        try {
            return UserRoleRepository.getUserRolesByRoleID(roleID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getUserRolesByRoleID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteUserRole(userID, roleID) {
        try {
            return UserRoleRepository.deleteUserRole(userID, roleID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteUserRole service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllRolesForUser(userID) {
        try {
            return UserRoleRepository.deleteAllRolesForUser(userID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllRolesForUser service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllUsersForRole(roleID) {
        try {
            return UserRoleRepository.deleteAllUsersForRole(roleID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllUsersForRole service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = UserRoleService;