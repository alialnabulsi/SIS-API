const Role = require("../models/roleModel");
const RoleService = require("../services/roleService");

class RoleController {
    static async createRole(req, res) {
        try {
            const { roleName, roleDescription } = req.body;
            const role = new Role(0, roleName, roleDescription);
            const result = await RoleService.createRole(role);
            res.status(201).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Role does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getRole(req, res) {
        try {
            const { roleName } = req.params;
            const result = await RoleService.getRole(roleName);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Role not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getRoleByID(req, res) {
        try {
            const { roleID } = req.params;
            const result = await RoleService.getRoleByID(roleID);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Role not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllRoles(req, res) {
        try {
            const result = await RoleService.getAllRoles();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No roles found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateRole(req, res) {
        try {
            const { roleName } = req.params;
            const updates = req.body;
            const result = await RoleService.updateRole(roleName, updates);
            res.status(204).json(result);
        } catch (e) {
            if (e.statusCode === 400) {
                res.status(e.statusCode).json({ message: 'No updates provided', error: e.message });
            } else  if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Role not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteRole(req, res) {
        try {
            const { roleName } = req.params;
            const result = await RoleService.deleteRole(roleName);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Role not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllRoles(req, res) {
        try {
            const result = await RoleService.deleteAllRoles();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No roles found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = RoleController;