const CourseRepository = require("../repositories/courseRepository");
const Course = require("../models/courseModel");

class CourseService {
    static async createCourse(course) {
        try {
            return CourseRepository.createCourse(course);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createCourse service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getCourse(courseID) {
        try {
            return CourseRepository.getCourse(courseID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getCourse service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getCourseByName(name) {
        try {
            return CourseRepository.getCourseByName(name);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getCourseByName service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllCourses() {
        try {
            return CourseRepository.getAllCourses();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllCourses service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateCourse(courseID, updates) {
        try {
            return CourseRepository.updateCourse(courseID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateCourse service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteCourse(courseID) {
        try {
            return CourseRepository.deleteCourse(courseID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteCourse service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllCourses() {
        try {
            return CourseRepository.deleteAllCourses();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllCourses service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = CourseService;