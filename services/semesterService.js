const SemesterRepository = require("../repositories/semesterRepository");
const Semester = require("../models/semesterModel");

class SemesterService {
    static async createSemester(semester) {
        try {
            return SemesterRepository.createSemester(semester);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getSemester(semesterID) {
        try {
            return SemesterRepository.getSemester(semesterID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getSemesterByNameAndYear(name, year) {
        try {
            return SemesterRepository.getSemesterByNameAndYear(name, year);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getAllSemesters() {
        try {
            return SemesterRepository.getAllSemesters();
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async updateSemester(semesterID, updates) {
        try {
            return SemesterRepository.updateSemester(semesterID, updates);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteSemester(semesterID) {
        try {
            return SemesterRepository.deleteSemester(semesterID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteAllSemesters() {
        try {
            return SemesterRepository.deleteAllSemesters();
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = SemesterService;