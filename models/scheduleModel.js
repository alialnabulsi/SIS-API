class Schedule {
    constructor(scheduleID, roomID, startTime, endTime, day, scheduleType) {
        this.scheduleID = scheduleID;
        this.roomID = roomID;
        this.startTime = startTime;
        this.endTime = endTime;
        this.day = day;
        this.scheduleType = scheduleType;
    }

    static fromRow(row) {
        return new Schedule(
            row.scheduleID,
            row.roomID,
            row.startTime,
            row.endTime,
            row.day,
            row.scheduleType
        );
    }
}

module.exports = Schedule;