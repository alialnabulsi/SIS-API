const EnrollmentRepository = require("../repositories/enrollmentRepository");
const Enrollment = require("../models/enrollmentModel");
const StudentService = require("./studentService");
const SectionService = require("./sectionService");
const CourseService = require("./courseService");

class EnrollmentService {
    static async createEnrollment(enrollment) {
        try {
            // Check if the student exists
            const studentExists = await StudentService.getStudentByID(enrollment.studentID);
            if (!studentExists) {
                const error = new Error("Student does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the section exists
            const sectionExists = await SectionService.getSection(enrollment.sectionID);
            if (!sectionExists) {
                const error = new Error("Section does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the course exists
            const courseExists = await CourseService.getCourseByID(enrollment.courseID);
            if (!courseExists) {
                const error = new Error("Course does not exist");
                error.statusCode = 404;
                throw error;
            }

            return EnrollmentRepository.createEnrollment(enrollment);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createEnrollment service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getEnrollment(enrollmentID) {
        try {
            return EnrollmentRepository.getEnrollment(enrollmentID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getEnrollment service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllEnrollments() {
        try {
            return EnrollmentRepository.getAllEnrollments();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllEnrollments service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateEnrollment(enrollmentID, updates) {
        try {
            return EnrollmentRepository.updateEnrollment(enrollmentID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateEnrollment service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteEnrollment(enrollmentID) {
        try {
            return EnrollmentRepository.deleteEnrollment(enrollmentID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteEnrollment service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllEnrollments() {
        try {
            return EnrollmentRepository.deleteAllEnrollments();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllEnrollments service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = EnrollmentService;