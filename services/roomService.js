const RoomRepository = require("../repositories/roomRepository");
const Room = require("../models/roomModel");
const BuildingRepository = require("../repositories/buildingRepository");

class RoomService {
    static async createRoom(room) {
        // Check if the building exists
        const buildingExists = await BuildingRepository.buildingExistsByID(room.buildingID);
        if (!buildingExists) {
            const error = new Error("Building does not exist");
            error.statusCode = 404;
            throw error;
        }
        try {
            return RoomRepository.createRoom(room);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getRoom(roomNumber) {
        try {
            return RoomRepository.getRoom(roomNumber);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getRoomByID(roomID) {
        try {
            return RoomRepository.getRoomByID(roomID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getAllRooms() {
        try {
            return RoomRepository.getAllRooms();
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async updateRoom(roomNumber, updates) {
        if (updates.buildingID) {
            const buildingExists = await BuildingRepository.buildingExistsByID(updates.buildingID);
            
            if (!buildingExists) {
                const error = new Error("Building does not exist");
                error.statusCode = 404;
                error.buildingNotFound = true;
                throw error;
            }
        }

        try {
            return RoomRepository.updateRoom(roomNumber, updates);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteRoom(roomNumber) {
        try {
            return RoomRepository.deleteRoom(roomNumber);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteAllRooms() {
        try {
            return RoomRepository.deleteAllRooms();
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = RoomService;