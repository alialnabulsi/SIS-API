const express = require('express');
const RoomController = require('../controllers/roomController');
const { validateRoom, validateRoomIDParam, validateRoomNumberParam, validateRoomUpdate } = require('../validators/roomDTO');

const router = express.Router();

router.post('/', validateRoom, RoomController.createRoom);
router.get('/:roomNumber', validateRoomNumberParam, RoomController.getRoom);
router.get('/id/:roomID', validateRoomIDParam, RoomController.getRoomByID);
router.get('/', RoomController.getAllRooms);
router.put('/:roomNumber', validateRoomUpdate, RoomController.updateRoom);
router.delete('/:roomNumber', validateRoomNumberParam, RoomController.deleteRoom);
router.delete('/', RoomController.deleteAllRooms);

module.exports = router;