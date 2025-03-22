const CourseProgramRepository = require("../repositories/courseProgramRepository");
const CourseProgram = require("../models/courseProgramModel");
const CourseService = require("./courseService");
const ProgramService = require("./programService");

class CourseProgramService {
    static async createCourseProgram(courseProgram) {
        try {
            // Check if the course exists
            const courseExists = await CourseService.getCourse(courseProgram.courseID);
            if (!courseExists) {
                const error = new Error("Course does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the program exists
            const programExists = await ProgramService.getProgramByID(courseProgram.programID);
            if (!programExists) {
                const error = new Error("Program does not exist");
                error.statusCode = 404;
                throw error;
            }

            return CourseProgramRepository.createCourseProgram(courseProgram);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createCourseProgram service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getCourseProgram(courseProgramID) {
        try {
            return CourseProgramRepository.getCourseProgram(courseProgramID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getCourseProgram service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getCourseProgramByCourseAndProgram(courseID, programID) {
        try {
            return CourseProgramRepository.getCourseProgramByCourseAndProgram(courseID, programID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getCourseProgramByCourseAndProgram service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllCoursePrograms() {
        try {
            return CourseProgramRepository.getAllCoursePrograms();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllCoursePrograms service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateCourseProgram(courseProgramID, updates) {
        try {
            return CourseProgramRepository.updateCourseProgram(courseProgramID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateCourseProgram service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteCourseProgram(courseProgramID) {
        try {
            return CourseProgramRepository.deleteCourseProgram(courseProgramID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteCourseProgram service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllCoursePrograms() {
        try {
            return CourseProgramRepository.deleteAllCoursePrograms();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllCoursePrograms service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = CourseProgramService;