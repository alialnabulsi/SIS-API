const MinorRepository = require("../repositories/minorRepository");
const Minor = require("../models/minorModel");
const DepartmentService = require("./departmentService");

class MinorService {
    static async createMinor(minor) {
        try {
            // Check if the department exists
            const departmentExists = await DepartmentService.getDepartmentByID(minor.departmentID);
            if (!departmentExists) {
                const error = new Error("Department does not exist");
                error.statusCode = 404;
                throw error;
            }

            return MinorRepository.createMinor(minor);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createMinor service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getMinor(name) {
        try {
            return MinorRepository.getMinor(name);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getMinor service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getMinorByID(minorID) {
        try {
            return MinorRepository.getMinorByID(minorID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getMinorByID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllMinors() {
        try {
            return MinorRepository.getAllMinors();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllMinors service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateMinor(minorID, updates) {
        try {
            return MinorRepository.updateMinor(minorID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateMinor service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteMinor(name) {
        try {
            return MinorRepository.deleteMinor(name);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteMinor service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllMinors() {
        try {
            return MinorRepository.deleteAllMinors();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllMinors service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = MinorService;