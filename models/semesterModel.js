class Semester {
    constructor(semesterID, name, year) {
        this.semesterID = semesterID;
        this.name = name;
        this.year = year;
    }

    static fromRow(row) {
        return new Semester(
            row.semesterID,
            row.name,
            row.year
        );
    }
}

module.exports = Semester;