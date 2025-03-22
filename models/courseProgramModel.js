class CourseProgram {
    constructor(courseProgramID, courseID, programID) {
        this.courseProgramID = courseProgramID;
        this.courseID = courseID;
        this.programID = programID;
    }

    static fromRow(row) {
        return new CourseProgram(
            row.courseProgramID,
            row.courseID,
            row.programID
        );
    }
}

module.exports = CourseProgram;