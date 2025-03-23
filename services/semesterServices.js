const SemesterRepository = require("../repositories/semesterRepository");
const Semester = require("../models/semesterModel");

class SemesterService {
    static async createSemester(semester) {
        try {
            return SemesterRepository.createSemester(semester);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createSemester service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getSemester(semesterID) {
        try {
            return SemesterRepository.getSemester(semesterID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getSemester service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getSemesterByNameAndYear(name, year) {
        try {
            return SemesterRepository.getSemesterByNameAndYear(name, year);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getSemesterByNameAndYear service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllSemesters() {
        try {
            return SemesterRepository.getAllSemesters();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllSemesters service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateSemester(semesterID, updates) {
        try {
            return SemesterRepository.updateSemester(semesterID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateSemester service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteSemester(semesterID) {
        try {
            return SemesterRepository.deleteSemester(semesterID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteSemester service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllSemesters() {
        try {
            return SemesterRepository.deleteAllSemesters();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllSemesters service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = SemesterService;