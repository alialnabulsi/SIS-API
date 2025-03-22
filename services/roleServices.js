const RoleRepository = require("../repositories/roleRepository");
const Role = require("../models/roleModel");

class RoleService {
    static async createRole(role) {
        try {
            return RoleRepository.createRole(role);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createRole service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getRole(roleName) {
        try {
            return RoleRepository.getRole(roleName);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getRole service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getRoleByID(roleID) {
        try {
            return RoleRepository.getRoleByID(roleID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getRoleByID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllRoles() {
        try {
            return RoleRepository.getAllRoles();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllRoles service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateRole(roleID, updates) {
        try {
            return RoleRepository.updateRole(roleID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateRole service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteRole(roleName) {
        try {
            return RoleRepository.deleteRole(roleName);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteRole service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllRoles() {
        try {
            return RoleRepository.deleteAllRoles();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllRoles service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = RoleService;