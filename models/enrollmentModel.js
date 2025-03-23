class Enrollment {
    constructor(enrollmentID, studentID, sectionID, courseID, status, enrollmentDate, grade) {
        this.enrollmentID = enrollmentID;
        this.studentID = studentID;
        this.sectionID = sectionID;
        this.courseID = courseID;
        this.status = status;
        this.enrollmentDate = enrollmentDate;
        this.grade = grade;
    }

    static fromRow(row) {
        return new Enrollment(
            row.enrollmentID,
            row.studentID,
            row.sectionID,
            row.courseID,
            row.status,
            row.enrollmentDate,
            row.grade
        );
    }
}

module.exports = Enrollment;