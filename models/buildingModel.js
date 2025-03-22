class Building {
    constructor(buildingID, campusID, name, numberOfFloors) {
        this.buildingID = buildingID;
        this.campusID = campusID;
        this.name = name;
        this.numberOfFloors = numberOfFloors;
    }

    static fromRow(row) {
        return new Building(
            row.buildingID,
            row.campusID,
            row.name,
            row.numberOfFloors
        );
    }
}

module.exports = Building;
