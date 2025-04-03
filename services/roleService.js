const RoleRepository = require("../repositories/roleRepository");
const Role = require("../models/roleModel");

class RoleService {
    static async createRole(role) {
        try {
            return RoleRepository.createRole(role);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getRole(roleName) {
        try {
            return RoleRepository.getRole(roleName);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getRoleByID(roleID) {
        try {
            return RoleRepository.getRoleByID(roleID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getAllRoles() {
        try {
            return RoleRepository.getAllRoles();
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async updateRole(roleID, updates) {
        try {
            return RoleRepository.updateRole(roleID, updates);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteRole(roleName) {
        try {
            return RoleRepository.deleteRole(roleName);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteAllRoles() {
        try {
            return RoleRepository.deleteAllRoles();
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = RoleService;