const FinalExamRepository = require("../repositories/finalExamRepository");
const FinalExam = require("../models/finalExamModel");
const CourseRepository = require("../repositories/courseRepository");

class FinalExamService {
    static async createFinalExam(finalExam) {
         // Check if the course exists
         const courseExists = await CourseRepository.courseExists(finalExam.courseID);
         if (!courseExists) {
             const error = new Error("Course does not exist");
             error.statusCode = 404;
             throw error;
         }
        try {
            return FinalExamRepository.createFinalExam(finalExam);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getFinalExam(finalExamID) {
        try {
            return FinalExamRepository.getFinalExam(finalExamID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getFinalExamByCourse(courseID) {
        try {
            return FinalExamRepository.getFinalExamByCourse(courseID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getAllFinalExams() {
        try {
            return FinalExamRepository.getAllFinalExams();
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async updateFinalExam(finalExamID, updates) {
        if (updates.courseID) {
            const courseExists = await CourseRepository.courseExists(updates.courseID);
            
            if (!courseExists) {
                const error = new Error("Course does not exist");
                error.statusCode = 404;
                error.courseNotFound = true;
                throw error;
            }
        }
        try {
            return FinalExamRepository.updateFinalExam(finalExamID, updates);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteFinalExam(finalExamID) {
        try {
            return FinalExamRepository.deleteFinalExam(finalExamID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteAllFinalExams() {
        try {
            return FinalExamRepository.deleteAllFinalExams();
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = FinalExamService;