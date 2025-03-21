// Campus Model

class Campus {
    constructor(campusID, locationID, name) {
        this.campusID = campusID;
        this.locationID = locationID;
        this.name = name;
    }

    static fromRow(row) {
        return new Campus(
            row.campusID,
            row.locationID,
            row.name
        );
    }
}

module.exports = Campus;
