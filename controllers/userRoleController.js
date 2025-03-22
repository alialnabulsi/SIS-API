const UserRole = require("../models/userRoleModel");
const UserRoleService = require("../services/userRoleService");

class UserRoleController {
    static async createUserRole(req, res) {
        try {
            const { userID, roleID } = req.body;
            const userRole = new UserRole(userID, roleID);
            const result = await UserRoleService.createUserRole(userRole);
            res.status(201).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'User or Role does not exist', error: e.message });
            } else if (e.statusCode === 400) {
                res.status(e.statusCode).json({ message: 'User-Role relationship already exists', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getUserRolesByUserID(req, res) {
        try {
            const { userID } = req.params;
            const result = await UserRoleService.getUserRolesByUserID(userID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No roles found for this user', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getUserRolesByRoleID(req, res) {
        try {
            const { roleID } = req.params;
            const result = await UserRoleService.getUserRolesByRoleID(roleID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No users found for this role', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteUserRole(req, res) {
        try {
            const { userID, roleID } = req.params;
            const result = await UserRoleService.deleteUserRole(userID, roleID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'User-Role relationship does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllRolesForUser(req, res) {
        try {
            const { userID } = req.params;
            const result = await UserRoleService.deleteAllRolesForUser(userID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No roles found for this user', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllUsersForRole(req, res) {
        try {
            const { roleID } = req.params;
            const result = await UserRoleService.deleteAllUsersForRole(roleID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No users found for this role', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = UserRoleController;