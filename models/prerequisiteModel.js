class Prerequisite {
    constructor(prerequisiteCourseID, courseID, prerequisiteID, prerequisiteType) {
        this.prerequisiteCourseID = prerequisiteCourseID;
        this.courseID = courseID;
        this.prerequisiteID = prerequisiteID;
        this.prerequisiteType = prerequisiteType;
    }

    static fromRow(row) {
        return new Prerequisite(
            row.prerequisiteCourseID,
            row.courseID,
            row.prerequisiteID,
            row.prerequisiteType
        );
    }
}

module.exports = Prerequisite;