const HoldRepository = require("../repositories/holdRepository");
const Hold = require("../models/holdModel");
const StudentService = require("./studentService");
const SemesterService = require("./semesterService");

class HoldService {
    static async createHold(hold) {
        try {
            // Check if the student exists
            const studentExists = await StudentService.getStudentByID(hold.studentID);
            if (!studentExists) {
                const error = new Error("Student does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the semester exists
            const semesterExists = await SemesterService.getSemesterByID(hold.semesterID);
            if (!semesterExists) {
                const error = new Error("Semester does not exist");
                error.statusCode = 404;
                throw error;
            }

            return HoldRepository.createHold(hold);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createHold service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getHoldByID(holdID) {
        try {
            return HoldRepository.getHoldByID(holdID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getHoldByID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getHoldsByStudentID(studentID) {
        try {
            return HoldRepository.getHoldsByStudentID(studentID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getHoldsByStudentID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getHoldsBySemesterID(semesterID) {
        try {
            return HoldRepository.getHoldsBySemesterID(semesterID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getHoldsBySemesterID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateHold(holdID, updates) {
        try {
            return HoldRepository.updateHold(holdID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateHold service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteHold(holdID) {
        try {
            return HoldRepository.deleteHold(holdID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteHold service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllHoldsForStudent(studentID) {
        try {
            return HoldRepository.deleteAllHoldsForStudent(studentID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllHoldsForStudent service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllHoldsForSemester(semesterID) {
        try {
            return HoldRepository.deleteAllHoldsForSemester(semesterID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllHoldsForSemester service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = HoldService;