const FinalExamRepository = require("../repositories/finalExamRepository");
const FinalExam = require("../models/finalExamModel");
const CourseService = require("./courseService");

class FinalExamService {
    static async createFinalExam(finalExam) {
        try {
            // Check if the course exists
            const courseExists = await CourseService.getCourse(finalExam.courseID);
            if (!courseExists) {
                const error = new Error("Course does not exist");
                error.statusCode = 404;
                throw error;
            }

            return FinalExamRepository.createFinalExam(finalExam);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createFinalExam service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getFinalExam(finalExamID) {
        try {
            return FinalExamRepository.getFinalExam(finalExamID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getFinalExam service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getFinalExamByCourse(courseID) {
        try {
            return FinalExamRepository.getFinalExamByCourse(courseID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getFinalExamByCourse service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllFinalExams() {
        try {
            return FinalExamRepository.getAllFinalExams();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllFinalExams service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateFinalExam(finalExamID, updates) {
        try {
            return FinalExamRepository.updateFinalExam(finalExamID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateFinalExam service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteFinalExam(finalExamID) {
        try {
            return FinalExamRepository.deleteFinalExam(finalExamID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteFinalExam service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllFinalExams() {
        try {
            return FinalExamRepository.deleteAllFinalExams();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllFinalExams service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = FinalExamService;