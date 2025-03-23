class FinalExamSchedule {
    constructor(finalExamScheduleID, finalExamID, scheduleID) {
        this.finalExamScheduleID = finalExamScheduleID;
        this.finalExamID = finalExamID;
        this.scheduleID = scheduleID;
    }

    static fromRow(row) {
        return new FinalExamSchedule(
            row.finalExamScheduleID,
            row.finalExamID,
            row.scheduleID
        );
    }
}

module.exports = FinalExamSchedule;