const Advisor = require("../models/advisorModel");
const AdvisorService = require("../services/advisorService");

class AdvisorController {
    static async createAdvisor(req, res) {
        try {
            const { userID, departmentID } = req.body;
            const advisor = new Advisor(null, userID, departmentID); // advisorID will be generated
            const result = await AdvisorService.createAdvisor(advisor);
            res.status(201).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'User or Department does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAdvisorByID(req, res) {
        try {
            const { advisorID } = req.params;
            const result = await AdvisorService.getAdvisorByID(advisorID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Advisor not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAdvisorByUserID(req, res) {
        try {
            const { userID } = req.params;
            const result = await AdvisorService.getAdvisorByUserID(userID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Advisor not found for this user', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAdvisorsByDepartmentID(req, res) {
        try {
            const { departmentID } = req.params;
            const result = await AdvisorService.getAdvisorsByDepartmentID(departmentID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No advisors found for this department', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateAdvisor(req, res) {
        try {
            const { advisorID } = req.params;
            const updates = req.body;
            const result = await AdvisorService.updateAdvisor(advisorID, updates);
            res.status(204).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Advisor not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAdvisor(req, res) {
        try {
            const { advisorID } = req.params;
            const result = await AdvisorService.deleteAdvisor(advisorID);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Advisor not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllAdvisors(req, res) {
        try {
            const result = await AdvisorService.deleteAllAdvisors();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No advisors found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = AdvisorController;