const moment = require("moment");
class Department {
    constructor(departmentID, facultyID, buildingID, name, establishedYear, contactEmail, contactPhone) {
        this.departmentID = departmentID;
        this.facultyID = facultyID;
        this.buildingID = buildingID;
        this.name = name;
        this.establishedYear = establishedYear;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
    }

    static fromRow(row) {
        return new Department(
            row.departmentID,
            row.facultyID,
            row.buildingID,
            row.name,
            moment(row.establishedYear).format('YYYY-MM-DD'),            
            row.contactEmail,
            row.contactPhone
        );
    }
}

module.exports = Department;