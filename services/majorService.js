const MajorRepository = require("../repositories/majorRepository");
const Major = require("../models/majorModel");
const DepartmentService = require("./departmentService");

class MajorService {
    static async createMajor(major) {
        try {
            // Check if the department exists
            const departmentExists = await DepartmentService.getDepartmentByID(major.departmentID);
            if (!departmentExists) {
                const error = new Error("Department does not exist");
                error.statusCode = 404;
                throw error;
            }

            return MajorRepository.createMajor(major);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createMajor service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getMajor(name) {
        try {
            return MajorRepository.getMajor(name);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getMajor service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getMajorByID(majorID) {
        try {
            return MajorRepository.getMajorByID(majorID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getMajorByID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllMajors() {
        try {
            return MajorRepository.getAllMajors();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllMajors service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateMajor(majorID, updates) {
        try {
            return MajorRepository.updateMajor(majorID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateMajor service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteMajor(name) {
        try {
            return MajorRepository.deleteMajor(name);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteMajor service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllMajors() {
        try {
            return MajorRepository.deleteAllMajors();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllMajors service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = MajorService;