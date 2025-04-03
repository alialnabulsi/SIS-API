const DepartmentRepository = require("../repositories/departmentRepository");
const Department = require("../models/departmentModel");
const FacultyRepository = require("../repositories/facultyRepository");
const BuildingRepository = require("../repositories/buildingRepository");

class DepartmentService {
    static async createDepartment(department) {
        try {
            // Check if the faculty exists
            const facultyExists = await FacultyRepository.getFacultyByID(department.facultyID);
            if (!facultyExists) {
                const error = new Error("Faculty does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the building exists
            const buildingExists = await BuildingRepository.getBuildingByID(department.buildingID);
            if (!buildingExists) {
                const error = new Error("Building does not exist");
                error.statusCode = 404;
                throw error;
            }

            return DepartmentRepository.createDepartment(department);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getDepartment(name) {
        try {
            return DepartmentRepository.getDepartment(name);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getDepartmentByID(departmentID) {
        try {
            return DepartmentRepository.getDepartmentByID(departmentID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getAllDepartments() {
        try {
            return DepartmentRepository.getAllDepartments();
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async updateDepartment(departmentID, updates) {
        try {
            return DepartmentRepository.updateDepartment(departmentID, updates);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteDepartment(name) {
        try {
            return DepartmentRepository.deleteDepartment(name);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteAllDepartments() {
        try {
            return DepartmentRepository.deleteAllDepartments();
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = DepartmentService;