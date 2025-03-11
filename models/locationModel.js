//Location Model

class Location{
    constructor(locationID, city, zipCode, address){
        this.locationID = locationID;
        this.city = city;
        this.zipCode = zipCode;
        this.address = address;
    }

    static fromRow(row){
        return new Location(
            row.LocationID,
            row.city,
            row.zipCode,
            row.address
        );
    }
}

module.exports = Location;