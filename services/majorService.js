const MajorRepository = require("../repositories/majorRepository");
const Major = require("../models/majorModel");
const DepartmentRepository = require("../repositories/departmentRepository");

class MajorService {
    static async createMajor(major) {
        // Check if the department exists
        const departmentExists = await DepartmentRepository.departmentExistsByID(major.departmentID);
        if (!departmentExists) {
            const error = new Error("Department does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            return MajorRepository.createMajor(major);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getMajor(name) {
        try {
            return MajorRepository.getMajor(name);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getMajorByID(majorID) {
        try {
            return MajorRepository.getMajorByID(majorID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getAllMajors() {
        try {
            return MajorRepository.getAllMajors();
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async updateMajor(majorID, updates) {
        if (updates.departmentID) {
            const departmentExists = await DepartmentRepository.departmentExistsByID(major.departmentID);
            
            if (!departmentExists) {
                const error = new Error("Department does not exist");
                error.statusCode = 404;
                error.departmentNotFound = true;
                throw error;
            }
        }
        try {
            return MajorRepository.updateMajor(majorID, updates);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteMajor(name) {
        try {
            return MajorRepository.deleteMajor(name);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteAllMajors() {
        try {
            return MajorRepository.deleteAllMajors();
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = MajorService;