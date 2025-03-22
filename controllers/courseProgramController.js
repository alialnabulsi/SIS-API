const CourseProgram = require("../models/courseProgramModel");
const CourseProgramService = require("../services/courseProgramService");

class CourseProgramController {
    static async createCourseProgram(req, res) {
        try {
            const { courseID, programID } = req.body;
            const courseProgram = new CourseProgram(0, courseID, programID);
            const result = await CourseProgramService.createCourseProgram(courseProgram);
            res.status(201).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Course or Program does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getCourseProgram(req, res) {
        try {
            const { courseProgramID } = req.params;
            const result = await CourseProgramService.getCourseProgram(courseProgramID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'CourseProgram not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getCourseProgramByCourseAndProgram(req, res) {
        try {
            const { courseID, programID } = req.params;
            const result = await CourseProgramService.getCourseProgramByCourseAndProgram(courseID, programID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'CourseProgram not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllCoursePrograms(req, res) {
        try {
            const result = await CourseProgramService.getAllCoursePrograms();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No course_programs found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateCourseProgram(req, res) {
        try {
            const { courseProgramID } = req.params;
            const updates = req.body;
            const result = await CourseProgramService.updateCourseProgram(courseProgramID, updates);
            res.status(204).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'CourseProgram not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteCourseProgram(req, res) {
        try {
            const { courseProgramID } = req.params;
            const result = await CourseProgramService.deleteCourseProgram(courseProgramID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'CourseProgram not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllCoursePrograms(req, res) {
        try {
            const result = await CourseProgramService.deleteAllCoursePrograms();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No course_programs found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = CourseProgramController;