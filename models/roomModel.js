class Room {
    constructor(roomID, buildingID, roomNumber, type, capacity) {
        this.roomID = roomID;
        this.buildingID = buildingID;
        this.roomNumber = roomNumber;
        this.type = type;
        this.capacity = capacity;
    }

    static fromRow(row) {
        return new Room(
            row.roomID,
            row.buildingID,
            row.roomNumber,
            row.type,
            row.capacity
        );
    }
}

module.exports = Room;