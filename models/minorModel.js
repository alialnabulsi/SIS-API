class Minor {
    constructor(minorID, departmentID, name) {
        this.minorID = minorID;
        this.departmentID = departmentID;
        this.name = name;
    }

    static fromRow(row) {
        return new Minor(
            row.minorID,
            row.departmentID,
            row.name
        );
    }
}

module.exports = Minor;