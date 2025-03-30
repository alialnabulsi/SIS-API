const Room = require("../models/roomModel");
const RoomService = require("../services/roomService");

class RoomController {
    static async createRoom(req, res) {
        try {
            const { buildingID, roomNumber, type, capacity } = req.body;
            const room = new Room(0, buildingID, roomNumber, type, capacity);
            const result = await RoomService.createRoom(room);
            res.status(201).json(result);
        } catch (e) {
            if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'Room already exists', error: e.message });
            } else if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Building does not exist', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getRoom(req, res) {
        try {
            const { roomNumber } = req.params;
            const result = await RoomService.getRoom(roomNumber);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Room not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getRoomByID(req, res) {
        try {
            const { roomID } = req.params;
            const result = await RoomService.getRoomByID(roomID);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Room not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllRooms(req, res) {
        try {
            const result = await RoomService.getAllRooms();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No rooms found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateRoom(req, res) {
        try {
            const { roomNumber } = req.params;
            const updates = req.body;
            const result = await RoomService.updateRoom(roomNumber, updates);
            res.status(204).json(result);
        } catch (e) {
            if (e.statusCode === 400) {
                res.status(e.statusCode).json({ message: 'No updates provided', error: e.message });
            } else if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'The new Room number already exists', error: e.message });
            } else if (e.statusCode === 404) {
                const message = e.buildingNotFound
                    ? 'Buiding not found'
                    : 'Room not found'; 
                res.status(e.statusCode).json({ message, error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteRoom(req, res) {
        try {
            const { roomNumber } = req.params;
            const result = await RoomService.deleteRoom(roomNumber);
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Room not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllRooms(req, res) {
        try {
            const result = await RoomService.deleteAllRooms();
            res.status(200).json(result);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e.message);
            }
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No rooms found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }
}

module.exports = RoomController;