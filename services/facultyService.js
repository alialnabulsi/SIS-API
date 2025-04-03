const FacultyRepository = require("../repositories/facultyRepository");
const Faculty = require("../models/facultyModel");

class FacultyService {
    static async createFaculty(faculty) {
        try {
            return FacultyRepository.createFaculty(faculty);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getFaculty(name) {
        try {
            return FacultyRepository.getFaculty(name);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getFacultyByID(facultyID) {
        try {
            return FacultyRepository.getFacultyByID(facultyID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getAllFaculties() {
        try {
            return FacultyRepository.getAllFaculties();
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async updateFaculty(facultyID, updates) {
        try {
            return FacultyRepository.updateFaculty(facultyID, updates);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteFaculty(name) {
        try {
            return FacultyRepository.deleteFaculty(name);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteAllFaculties() {
        try {
            return FacultyRepository.deleteAllFaculties();
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = FacultyService;