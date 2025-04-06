const PrerequisiteRepository = require("../repositories/prerequisiteRepository");
const Prerequisite = require("../models/prerequisiteModel");
const CourseRepository = require("../repositories/courseRepository");

class PrerequisiteService {
    static async createPrerequisite(prerequisite) {
        // Check if the course exists
        const courseExists = await CourseRepository.courseExists(prerequisite.courseID);
        if (!courseExists) {
            const error = new Error("Course does not exist");
            error.statusCode = 404;
            throw error;
        }

        // Check if the prerequisite course exists
        const prerequisiteCourseExists = await CourseRepository.courseExists(prerequisite.prerequisiteID);
        if (!prerequisiteCourseExists) {
            const error = new Error("Prerequisite course does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            return PrerequisiteRepository.createPrerequisite(prerequisite);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getPrerequisite(prerequisiteCourseID) {
        try {
            return PrerequisiteRepository.getPrerequisite(prerequisiteCourseID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getPrerequisiteByCourseAndPrerequisite(courseID, prerequisiteID) {
        try {
            return PrerequisiteRepository.getPrerequisiteByCourseAndPrerequisite(courseID, prerequisiteID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getAllPrerequisites() {
        try {
            return PrerequisiteRepository.getAllPrerequisites();
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async updatePrerequisite(prerequisiteCourseID, updates) {
        
        if (updates.courseID) {
            const courseExists = await CourseRepository.courseExists(updates.courseID);
            if (!courseExists) {
                const error = new Error("Course does not exist");
                error.statusCode = 404;
                error.courseNotFound = true;
                throw error;
            }
            const {prerequisiteID } = await PrerequisiteRepository.getPrerequisite(prerequisiteCourseID);
            const prerequisiteExists = await PrerequisiteRepository.prerequisiteExistsByCourseAndPrerequisite(updates.courseID,prerequisiteID);
            if (prerequisiteExists) {
                const error = new Error("This Prerequiste already exists");
                error.statusCode = 409;
                throw error;
            }
        }
        if (updates.prerequisiteID) {
            const courseExists = await CourseRepository.courseExists(updates.prerequisiteID);
            if (!courseExists) {
                const error = new Error("Prerequisite ID does not exist");
                error.statusCode = 404;
                error.courseNotFound = true;
                throw error;
            }
            const {courseID } = await PrerequisiteRepository.getPrerequisite(prerequisiteCourseID);
            const prerequisiteExists = await PrerequisiteRepository.prerequisiteExistsByCourseAndPrerequisite(courseID,updates.prerequisiteID);
            if (prerequisiteExists) {
                const error = new Error("This Prerequiste already exists");
                error.statusCode = 409;
                throw error;
            }
        }
        if (updates.courseID && updates.prerequisiteID) {
            const prerequisiteExists = await PrerequisiteRepository.prerequisiteExistsByCourseAndPrerequisite(updates.courseID,updates.prerequisiteID);
            if (prerequisiteExists) {
                const error = new Error("This Prerequiste already exists");
                error.statusCode = 409;
                throw error;
            }
        }
        
        try {
            return PrerequisiteRepository.updatePrerequisite(prerequisiteCourseID, updates);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deletePrerequisite(prerequisiteCourseID) {
        try {
            return PrerequisiteRepository.deletePrerequisite(prerequisiteCourseID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteAllPrerequisites() {
        try {
            return PrerequisiteRepository.deleteAllPrerequisites();
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = PrerequisiteService;