const StudentHoldRepository = require("../repositories/studentHoldRepository");
const StudentHold = require("../models/studentHoldModel");
const StudentService = require("./studentService");
const HoldService = require("./holdService");

class StudentHoldService {
    static async createStudentHold(studentHold) {
        try {
            // Check if the student exists
            const studentExists = await StudentService.getStudent(studentHold.studentID);
            if (!studentExists) {
                const error = new Error("Student does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the hold exists
            const holdExists = await HoldService.getHoldByID(studentHold.holdID);
            if (!holdExists) {
                const error = new Error("Hold does not exist");
                error.statusCode = 404;
                throw error;
            }

            return StudentHoldRepository.createStudentHold(studentHold);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createStudentHold service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getStudentHold(studentHoldID) {
        try {
            return StudentHoldRepository.getStudentHold(studentHoldID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getStudentHold service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getStudentHoldByStudentAndHold(studentID, holdID) {
        try {
            return StudentHoldRepository.getStudentHoldByStudentAndHold(studentID, holdID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getStudentHoldByStudentAndHold service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllStudentHolds() {
        try {
            return StudentHoldRepository.getAllStudentHolds();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllStudentHolds service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateStudentHold(studentHoldID, updates) {
        try {
            return StudentHoldRepository.updateStudentHold(studentHoldID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateStudentHold service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteStudentHold(studentHoldID) {
        try {
            return StudentHoldRepository.deleteStudentHold(studentHoldID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteStudentHold service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllStudentHolds() {
        try {
            return StudentHoldRepository.deleteAllStudentHolds();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllStudentHolds service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = StudentHoldService;