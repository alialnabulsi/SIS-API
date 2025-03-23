class StudentHold {
    constructor(studentHoldID, studentID, holdID) {
        this.studentHoldID = studentHoldID;
        this.studentID = studentID;
        this.holdID = holdID;
    }

    static fromRow(row) {
        return new StudentHold(
            row.studentHoldID,
            row.studentID,
            row.holdID
        );
    }
}

module.exports = StudentHold;