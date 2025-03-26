const AdvisorRepository = require("../repositories/advisorRepository");
const Advisor = require("../models/advisorModel");
const UserService = require("./userService");
const DepartmentService = require("./departmentService");

class AdvisorService {
    static async createAdvisor(advisor) {
        try {
            // Check if the user exists
            const userExists = await UserService.getUserByID(advisor.userID);
            if (!userExists) {
                const error = new Error("User does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the department exists
            const departmentExists = await DepartmentService.getDepartmentByID(advisor.departmentID);
            if (!departmentExists) {
                const error = new Error("Department does not exist");
                error.statusCode = 404;
                throw error;
            }

            return AdvisorRepository.createAdvisor(advisor);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createAdvisor service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAdvisorByID(advisorID) {
        try {
            return AdvisorRepository.getAdvisorByID(advisorID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAdvisorByID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAdvisorByUserID(userID) {
        try {
            return AdvisorRepository.getAdvisorByUserID(userID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAdvisorByUserID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAdvisorsByDepartmentID(departmentID) {
        try {
            return AdvisorRepository.getAdvisorsByDepartmentID(departmentID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAdvisorsByDepartmentID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateAdvisor(advisorID, updates) {
        try {
            return AdvisorRepository.updateAdvisor(advisorID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateAdvisor service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAdvisor(advisorID) {
        try {
            return AdvisorRepository.deleteAdvisor(advisorID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAdvisor service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllAdvisors() {
        try {
            return AdvisorRepository.deleteAllAdvisors();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllAdvisors service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = AdvisorService;