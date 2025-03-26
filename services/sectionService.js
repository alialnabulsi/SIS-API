const SectionRepository = require("../repositories/sectionRepository");
const Section = require("../models/sectionModel");
const CourseService = require("./courseService");
const ScheduleService = require("./scheduleService");
const InstructorService = require("./instructorService");
const FinalExamScheduleService = require("./finalExamScheduleService");
const SemesterService = require("./semesterService");

class SectionService {
    static async createSection(section) {
        try {
            // Check if the course exists
            const courseExists = await CourseService.getCourseByID(section.courseID);
            if (!courseExists) {
                const error = new Error("Course does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the schedule exists
            const scheduleExists = await ScheduleService.getScheduleByID(section.scheduleID);
            if (!scheduleExists) {
                const error = new Error("Schedule does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the instructor exists
            const instructorExists = await InstructorService.getInstructorByID(section.instructorID);
            if (!instructorExists) {
                const error = new Error("Instructor does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the final exam schedule exists
            const finalExamScheduleExists = await FinalExamScheduleService.getFinalExamSchedule(section.finalExamScheduleID);
            if (!finalExamScheduleExists) {
                const error = new Error("Final Exam Schedule does not exist");
                error.statusCode = 404;
                throw error;
            }

            // Check if the semester exists
            const semesterExists = await SemesterService.getSemesterByID(section.semesterID);
            if (!semesterExists) {
                const error = new Error("Semester does not exist");
                error.statusCode = 404;
                throw error;
            }

            return SectionRepository.createSection(section);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createSection service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getSection(sectionID) {
        try {
            return SectionRepository.getSection(sectionID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getSection service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllSections() {
        try {
            return SectionRepository.getAllSections();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllSections service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateSection(sectionID, updates) {
        try {
            return SectionRepository.updateSection(sectionID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateSection service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteSection(sectionID) {
        try {
            return SectionRepository.deleteSection(sectionID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteSection service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllSections() {
        try {
            return SectionRepository.deleteAllSections();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllSections service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = SectionService;