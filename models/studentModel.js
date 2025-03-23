class Student {
    constructor(studentID, userID, advisorID, programID, status, admissionYear) {
        this.studentID = studentID;
        this.userID = userID;
        this.advisorID = advisorID;
        this.programID = programID;
        this.status = status;
        this.admissionYear = admissionYear;
    }

    static fromRow(row) {
        return new Student(
            row.studentID,
            row.userID,
            row.advisorID,
            row.programID,
            row.status,
            row.admissionYear
        );
    }
}

module.exports = Student;