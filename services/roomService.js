const RoomRepository = require("../repositories/roomRepository");
const Room = require("../models/roomModel");
const BuildingService = require("./buildingService");

class RoomService {
    static async createRoom(room) {
        try {
            // Check if the building exists
            const buildingExists = await BuildingService.getBuildingByID(room.buildingID);
            if (!buildingExists) {
                const error = new Error("Building does not exist");
                error.statusCode = 404;
                throw error;
            }

            return RoomRepository.createRoom(room);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createRoom service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getRoom(roomNumber) {
        try {
            return RoomRepository.getRoom(roomNumber);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getRoom service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getRoomByID(roomID) {
        try {
            return RoomRepository.getRoomByID(roomID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getRoomByID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllRooms() {
        try {
            return RoomRepository.getAllRooms();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllRooms service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updateRoom(roomID, updates) {
        try {
            return RoomRepository.updateRoom(roomID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updateRoom service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteRoom(roomNumber) {
        try {
            return RoomRepository.deleteRoom(roomNumber);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteRoom service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllRooms() {
        try {
            return RoomRepository.deleteAllRooms();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllRooms service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = RoomService;