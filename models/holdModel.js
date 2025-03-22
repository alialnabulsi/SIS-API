class Hold {
    constructor(holdID, studentID, semesterID, reason) {
        this.holdID = holdID;
        this.studentID = studentID;
        this.semesterID = semesterID;
        this.reason = reason;
    }

    static fromRow(row) {
        return new Hold(
            row.holdID,
            row.studentID,
            row.semesterID,
            row.reason
        );
    }
}

module.exports = Hold;