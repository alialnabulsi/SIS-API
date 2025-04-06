const Prerequisite = require("../models/prerequisiteModel");
const PrerequisiteService = require("../services/prerequisiteService");

class PrerequisiteController {
    static async createPrerequisite(req, res) {
        try {
            const { courseID, prerequisiteID, prerequisiteType } = req.body;
            const prerequisite = new Prerequisite(0, courseID, prerequisiteID, prerequisiteType);
            const result = await PrerequisiteService.createPrerequisite(prerequisite);
            res.status(201).json(result);
        } catch (e) {
            if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'Prerequisite already exists', error: e.message });
            } else if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Course or Prerequisite course does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getPrerequisite(req, res) {
        try {
            const { prerequisiteCourseID } = req.params;
            const result = await PrerequisiteService.getPrerequisite(prerequisiteCourseID);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Prerequisite not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getPrerequisiteByCourseAndPrerequisite(req, res) {
        try {
            const { courseID, prerequisiteID } = req.params;
            const result = await PrerequisiteService.getPrerequisiteByCourseAndPrerequisite(courseID, prerequisiteID);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Prerequisite not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllPrerequisites(req, res) {
        try {
            const result = await PrerequisiteService.getAllPrerequisites();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No prerequisites found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updatePrerequisite(req, res) {
        try {
            const { prerequisiteCourseID } = req.params;
            const updates = req.body;
            const result = await PrerequisiteService.updatePrerequisite(prerequisiteCourseID, updates);
            res.status(204).json(result);
        } catch (e) {
            if (e.statusCode === 400) {
                res.status(e.statusCode).json({ message: 'No updates provided', error: e.message });
            } else if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'The new Prerequisite ID already exists', error: e.message });
            } else if (e.statusCode === 404) {
                const message = e.courseNotFound
                    ? 'Course not found'
                    : 'Prerequisite not found'; 
                res.status(e.statusCode).json({ message, error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deletePrerequisite(req, res) {
        try {
            const { prerequisiteCourseID } = req.params;
            const result = await PrerequisiteService.deletePrerequisite(prerequisiteCourseID);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Prerequisite not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllPrerequisites(req, res) {
        try {
            const result = await PrerequisiteService.deleteAllPrerequisites();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No prerequisites found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = PrerequisiteController;