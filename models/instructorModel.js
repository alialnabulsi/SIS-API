class Instructor {
    constructor(instructorID, userID, departmentID, hireDate) {
        this.instructorID = instructorID;
        this.userID = userID;
        this.departmentID = departmentID;
        this.hireDate = hireDate;
    }

    static fromRow(row) {
        return new Instructor(
            row.instructorID,
            row.userID,
            row.departmentID,
            row.hireDate
        );
    }
}

module.exports = Instructor;