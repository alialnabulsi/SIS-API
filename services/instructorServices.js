const InstructorRepository = require("../repositories/instructorRepository");
const Instructor = require("../models/instructorModel");
const UserService = require("./userService");
const DepartmentService = require("./departmentService");

class InstructorService {
    static async createInstructor(instructor) {
        try {
            // Check if the user exists
            const userExists = await UserService.getUserByID(instructor.userID);
            if (!userExists) {
                const error = new Error("User does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the department exists
            const departmentExists = await DepartmentService.getDepartmentByID(instructor.departmentID);
            if (!departmentExists) {
                const error = new Error("Department does not exist");
                error.statusCode = 404;
                throw error;
            }

            return InstructorRepository.createInstructor(instructor);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createInstructor service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getInstructorByID(instructorID) {
        try {
            return InstructorRepository.getInstructorByID(instructorID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getInstructorByID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getInstructorByUserID(userID) {
        try {
            return InstructorRepository.getInstructorByUserID(userID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getInstructorByUserID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getInstructorsByDepartmentID(departmentID) {
        try {
            return InstructorRepository.getInstructorsByDepartmentID(departmentID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getInstructorsByDepartmentID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateInstructor(instructorID, updates) {
        try {
            return InstructorRepository.updateInstructor(instructorID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateInstructor service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteInstructor(instructorID) {
        try {
            return InstructorRepository.deleteInstructor(instructorID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteInstructor service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = InstructorService;