class FinalExam {
    constructor(finalExamID, courseID) {
        this.finalExamID = finalExamID;
        this.courseID = courseID;
    }

    static fromRow(row) {
        return new FinalExam(
            row.finalExamID,
            row.courseID
        );
    }
}

module.exports = FinalExam;