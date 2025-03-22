class Course {
    constructor(courseID, name, credits) {
        this.courseID = courseID;
        this.name = name;
        this.credits = credits;
    }

    static fromRow(row) {
        return new Course(
            row.courseID,
            row.name,
            row.credits
        );
    }
}

module.exports = Course;