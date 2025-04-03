const Department = require("../models/departmentModel");
const DepartmentService = require("../services/departmentService");

class DepartmentController {
    static async createDepartment(req, res) {
        try {
            const { departmentID, facultyID, buildingID, name, establishedYear, contactEmail, contactPhone } = req.body;
            const department = new Department(departmentID, facultyID, buildingID, name, establishedYear, contactEmail, contactPhone);
            const result = await DepartmentService.createDepartment(department);
            res.status(201).json(result);
        } catch (e) {
            if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'Department already exists', error: e.message });
            } else if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Faculty or Building does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getDepartment(req, res) {
        try {
            const { name } = req.params;
            const result = await DepartmentService.getDepartment(name);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Department not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getDepartmentByID(req, res) {
        try {
            const { departmentID } = req.params;
            const result = await DepartmentService.getDepartmentByID(departmentID);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Department not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllDepartments(req, res) {
        try {
            const result = await DepartmentService.getAllDepartments();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No departments found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateDepartment(req, res) {
        try {
            const { departmentID } = req.params;
            const updates = req.body;
            const result = await DepartmentService.updateDepartment(departmentID, updates);
            res.status(204).json(result);
        } catch (e) {
            if (e.statusCode === 400) {
                res.status(e.statusCode).json({ message: 'No updates provided', error: e.message });
            } else if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'The new Department name already exists', error: e.message });
            } else
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Department not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteDepartment(req, res) {
        try {
            const { name } = req.params;
            const result = await DepartmentService.deleteDepartment(name);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Department not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllDepartments(req, res) {
        try {
            const result = await DepartmentService.deleteAllDepartments();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No departments found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = DepartmentController;