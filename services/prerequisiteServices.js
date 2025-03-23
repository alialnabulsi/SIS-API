const PrerequisiteRepository = require("../repositories/prerequisiteRepository");
const Prerequisite = require("../models/prerequisiteModel");
const CourseService = require("./courseService");

class PrerequisiteService {
    static async createPrerequisite(prerequisite) {
        try {
            // Check if the course exists
            const courseExists = await CourseService.getCourse(prerequisite.courseID);
            if (!courseExists) {
                const error = new Error("Course does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the prerequisite course exists
            const prerequisiteCourseExists = await CourseService.getCourse(prerequisite.prerequisiteID);
            if (!prerequisiteCourseExists) {
                const error = new Error("Prerequisite course does not exist");
                error.statusCode = 404;
                throw error;
            }

            return PrerequisiteRepository.createPrerequisite(prerequisite);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createPrerequisite service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getPrerequisite(prerequisiteCourseID) {
        try {
            return PrerequisiteRepository.getPrerequisite(prerequisiteCourseID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getPrerequisite service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getPrerequisiteByCourseAndPrerequisite(courseID, prerequisiteID) {
        try {
            return PrerequisiteRepository.getPrerequisiteByCourseAndPrerequisite(courseID, prerequisiteID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getPrerequisiteByCourseAndPrerequisite service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllPrerequisites() {
        try {
            return PrerequisiteRepository.getAllPrerequisites();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllPrerequisites service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updatePrerequisite(prerequisiteCourseID, updates) {
        try {
            return PrerequisiteRepository.updatePrerequisite(prerequisiteCourseID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updatePrerequisite service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deletePrerequisite(prerequisiteCourseID) {
        try {
            return PrerequisiteRepository.deletePrerequisite(prerequisiteCourseID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deletePrerequisite service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllPrerequisites() {
        try {
            return PrerequisiteRepository.deleteAllPrerequisites();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllPrerequisites service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = PrerequisiteService;