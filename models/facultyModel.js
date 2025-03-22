class Faculty {
    constructor(facultyID, name) {
        this.facultyID = facultyID;
        this.name = name;
    }

    static fromRow(row) {
        return new Faculty(
            row.facultyID,
            row.name
        );
    }
}

module.exports = Faculty;