class Advisor {
    constructor(advisorID, userID, departmentID) {
        this.advisorID = advisorID;
        this.userID = userID;
        this.departmentID = departmentID;
    }

    static fromRow(row) {
        return new Advisor(
            row.advisorID,
            row.userID,
            row.departmentID
        );
    }
}

module.exports = Advisor;