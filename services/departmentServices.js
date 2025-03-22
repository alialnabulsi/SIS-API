const DepartmentRepository = require("../repositories/departmentRepository");
const Department = require("../models/departmentModel");
const FacultyService = require("./facultyService");
const BuildingService = require("./buildingService");

class DepartmentService {
    static async createDepartment(department) {
        try {
            // Check if the faculty exists
            const facultyExists = await FacultyService.getFacultyByID(department.facultyID);
            if (!facultyExists) {
                const error = new Error("Faculty does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the building exists
            const buildingExists = await BuildingService.getBuildingByID(department.buildingID);
            if (!buildingExists) {
                const error = new Error("Building does not exist");
                error.statusCode = 404;
                throw error;
            }

            return DepartmentRepository.createDepartment(department);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createDepartment service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getDepartment(name) {
        try {
            return DepartmentRepository.getDepartment(name);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getDepartment service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getDepartmentByID(departmentID) {
        try {
            return DepartmentRepository.getDepartmentByID(departmentID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getDepartmentByID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllDepartments() {
        try {
            return DepartmentRepository.getAllDepartments();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllDepartments service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateDepartment(departmentID, updates) {
        try {
            return DepartmentRepository.updateDepartment(departmentID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateDepartment service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteDepartment(name) {
        try {
            return DepartmentRepository.deleteDepartment(name);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteDepartment service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllDepartments() {
        try {
            return DepartmentRepository.deleteAllDepartments();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllDepartments service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = DepartmentService;