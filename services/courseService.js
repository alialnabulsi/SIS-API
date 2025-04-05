const CourseRepository = require("../repositories/courseRepository");
const Course = require("../models/courseModel");

class CourseService {
    static async createCourse(course) {
        try {
            return CourseRepository.createCourse(course);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getCourse(courseID) {
        try {
            return CourseRepository.getCourse(courseID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getCourseByName(name) {
        try {
            return CourseRepository.getCourseByName(name);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getAllCourses() {
        try {
            return CourseRepository.getAllCourses();
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async updateCourse(courseID, updates) {
        try {
            return CourseRepository.updateCourse(courseID, updates);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteCourse(courseID) {
        try {
            return CourseRepository.deleteCourse(courseID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteAllCourses() {
        try {
            return CourseRepository.deleteAllCourses();
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = CourseService;