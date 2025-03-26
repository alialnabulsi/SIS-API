const ProgramRepository = require("../repositories/programRepository");
const Program = require("../models/programModel");
const MajorService = require("./majorService");
const MinorService = require("./minorService");

class ProgramService {
    static async createProgram(program) {
        try {
            // Check if the major exists
            const majorExists = await MajorService.getMajorByID(program.majorID);
            if (!majorExists) {
                const error = new Error("Major does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the minor exists
            const minorExists = await MinorService.getMinorByID(program.minorID);
            if (!minorExists) {
                const error = new Error("Minor does not exist");
                error.statusCode = 404;
                throw error;
            }

            return ProgramRepository.createProgram(program);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createProgram service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getProgram(name) {
        try {
            return ProgramRepository.getProgram(name);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getProgram service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getProgramByID(programID) {
        try {
            return ProgramRepository.getProgramByID(programID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getProgramByID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllPrograms() {
        try {
            return ProgramRepository.getAllPrograms();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllPrograms service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateProgram(programID, updates) {
        try {
            return ProgramRepository.updateProgram(programID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateProgram service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteProgram(name) {
        try {
            return ProgramRepository.deleteProgram(name);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteProgram service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllPrograms() {
        try {
            return ProgramRepository.deleteAllPrograms();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllPrograms service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = ProgramService;