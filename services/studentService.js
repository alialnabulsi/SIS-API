const StudentRepository = require("../repositories/studentRepository");
const Student = require("../models/studentModel");
const UserService = require("./userService");
const AdvisorService = require("./advisorService");
const ProgramService = require("./programService");

class StudentService {
    static async createStudent(student) {
        try {
            // Check if the user exists
            const userExists = await UserService.getUserByID(student.userID);
            if (!userExists) {
                const error = new Error("User does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the advisor exists
            const advisorExists = await AdvisorService.getAdvisorByID(student.advisorID);
            if (!advisorExists) {
                const error = new Error("Advisor does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the program exists
            const programExists = await ProgramService.getProgramByID(student.programID);
            if (!programExists) {
                const error = new Error("Program does not exist");
                error.statusCode = 404;
                throw error;
            }

            return StudentRepository.createStudent(student);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createStudent service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getStudent(studentID) {
        try {
            return StudentRepository.getStudent(studentID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getStudent service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getStudentByUserID(userID) {
        try {
            return StudentRepository.getStudentByUserID(userID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getStudentByUserID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllStudents() {
        try {
            return StudentRepository.getAllStudents();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllStudents service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateStudent(studentID, updates) {
        try {
            return StudentRepository.updateStudent(studentID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateStudent service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteStudent(studentID) {
        try {
            return StudentRepository.deleteStudent(studentID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteStudent service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllStudents() {
        try {
            return StudentRepository.deleteAllStudents();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllStudents service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = StudentService;