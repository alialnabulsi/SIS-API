class Major {
    constructor(majorID, departmentID, name) {
        this.majorID = majorID;
        this.departmentID = departmentID;
        this.name = name;
    }

    static fromRow(row) {
        return new Major(
            row.majorID,
            row.departmentID,
            row.name
        );
    }
}

module.exports = Major;