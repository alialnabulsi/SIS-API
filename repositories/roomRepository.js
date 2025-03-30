const Room = require("../models/roomModel");
const database = require("../config/db");
require('dotenv').config();

class RoomRepository {

    static async createRoom(room) {
        if (await this.roomExists(room.roomNumber)) {
            const error = new Error("Room already exists");
            error.statusCode = 409;
            throw error;
        }
        try {
            let sql = `INSERT INTO room 
            (buildingID, roomNumber, type, capacity)
            VALUES (?,?,?,?)`;
            const result = await database.query(sql, [room.buildingID, room.roomNumber, room.type, room.capacity]);
            const { affectedRows, insertId } = result;
            return {
                affectedRows,
                insertId: insertId.toString() // since it is BigInt so it can't be serialized
            };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async getRoom(roomNumber) {
        if (!await this.roomExists(roomNumber)) {
            const error = new Error("Room does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            let sql = `SELECT * FROM room WHERE roomNumber = ?`;

            const [row] = await database.query(sql, [roomNumber]);
            return Room.fromRow(row);

        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async getRoomByID(roomID) {
        if (!await this.roomExistsByID(roomID)) {
            const error = new Error("Room does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `SELECT * FROM room WHERE roomID = ?`;

            const [row] = await database.query(sql, [roomID]);
            

            return Room.fromRow(row);

        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async getAllRooms() {
        try {
            let sql = `SELECT * FROM room`;
            const row = await database.query(sql);
            if (!row || row.length === 0) {
                const error = new Error("No rooms exist");
                error.statusCode = 404;
                throw error;
            }
            return row.map(Room.fromRow);
        } catch (e) {
            throw e;
        }
    }

    static async updateRoom(roomNumber, updates) {
        if (!await this.roomExists(roomNumber)) {
            const error = new Error("Room does not exist");
            error.statusCode = 404;
            error.buildingNotFound = false;
            throw error;
        }
        if (!updates || Object.keys(updates).length === 0) {
            const error = new Error("No updates provided");
            error.statusCode = 400; 
            throw error;
        }
        if (updates.roomNumber  && updates.roomNumber.toLowerCase() !== roomNumber.toLowerCase()) {
            if (await this.roomExists(updates.roomNumber)) {
                const error = new Error("The new Room number already exists");
                error.statusCode = 409;
                throw error;
            }
        }

        try {

            let sql = "UPDATE room SET ";
            let conditions = [];
            let values = [];

            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }

            sql += conditions.join(", ");
            sql += " WHERE roomNumber = ?";
            values.push(roomNumber);

            const result = await database.query(sql, values);
            const { affectedRows } = result;

            return { affectedRows };
        } catch (e) {
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteRoom(roomNumber) {
        if (!await this.roomExists(roomNumber)) {
            const error = new Error("Room does not exist");
            error.statusCode = 404;
            throw error;
        }

        try {
            let sql = `DELETE FROM room WHERE roomNumber = ?`;
            const result = await database.query(sql, [roomNumber]);
            const { affectedRows } = result;
            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteRoom:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async deleteAllRooms() {
        try {
            let sql = `DELETE FROM room`;
            const result = await database.query(sql);
            const { affectedRows } = result;

            if (affectedRows === 0) {
                const error = new Error("No rooms to delete");
                error.statusCode = 404;
                throw error;
            }

            return { affectedRows };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in deleteAllRooms:", e);
            }
            throw e;
        }
    }

    // Check if the room exists by roomID
    static async roomExistsByID(roomID) {
        try {
            let sql = `SELECT * FROM room WHERE roomID = ?`;
            const rows = await database.query(sql, [roomID]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in roomExistsByID:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async roomExists(roomNumber) {
        try {
            let sql = `SELECT * FROM room WHERE roomNumber = ?`;
            const rows = await database.query(sql, [roomNumber]);

            if (rows && rows.length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in roomExists:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = RoomRepository;