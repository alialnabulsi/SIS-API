const Course = require("../models/courseModel");
const CourseService = require("../services/courseService");

class CourseController {
    static async createCourse(req, res) {
        try {
            const { courseID, name, credits } = req.body;
            const course = new Course(courseID, name, credits);
            const result = await CourseService.createCourse(course);
            res.status(201).json(result);
        } catch (e) {
            if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'Course already exists', error: e.message });
            } else if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Course does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getCourse(req, res) {
        try {
            const { courseID } = req.params;
            const result = await CourseService.getCourse(courseID);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Course not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getCourseByName(req, res) {
        try {
            const { name } = req.params;
            const result = await CourseService.getCourseByName(name);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Course not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllCourses(req, res) {
        try {
            const result = await CourseService.getAllCourses();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No courses found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateCourse(req, res) {
        try {
            const { courseID } = req.params;
            const updates = req.body;
            const result = await CourseService.updateCourse(courseID, updates);
            res.status(204).json(result);
        } catch (e) {
            if (e.statusCode === 400) {
                res.status(e.statusCode).json({ message: 'No updates provided', error: e.message });
            } else if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'The new Course ID already exists', error: e.message });
            } else
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Course not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteCourse(req, res) {
        try {
            const { courseID } = req.params;
            const result = await CourseService.deleteCourse(courseID);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Course not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllCourses(req, res) {
        try {
            const result = await CourseService.deleteAllCourses();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No courses found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = CourseController;