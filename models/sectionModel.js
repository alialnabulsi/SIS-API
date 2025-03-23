class Section {
    constructor(sectionID, courseID, scheduleID, instructorID, finalExamScheduleID, semesterID, sectionCapacity, enrolled, language) {
        this.sectionID = sectionID;
        this.courseID = courseID;
        this.scheduleID = scheduleID;
        this.instructorID = instructorID;
        this.finalExamScheduleID = finalExamScheduleID;
        this.semesterID = semesterID;
        this.sectionCapacity = sectionCapacity;
        this.enrolled = enrolled;
        this.language = language;
    }

    static fromRow(row) {
        return new Section(
            row.sectionID,
            row.courseID,
            row.scheduleID,
            row.instructorID,
            row.finalExamScheduleID,
            row.semesterID,
            row.sectionCapacity,
            row.enrolled,
            row.language
        );
    }
}

module.exports = Section;