const express = require('express');
const UserController = require('../controllers/userController');
const { validateUser, validateUserIDParam, validateUsernameParam, validateUserUpdate } = require('../validators/userDTO');

const router = express.Router();

router.post('/', validateUser, UserController.createUser);
router.get('/:username', validateUsernameParam, UserController.getUser);
router.get('/id/:userID', validateUserIDParam, UserController.getUserByID);
router.get('/', UserController.getAllUsers);
router.put('/:userID', validateUserUpdate, UserController.updateUser);
router.delete('/:username', validateUsernameParam, UserController.deleteUser);
router.delete('/', UserController.deleteAllUsers);

module.exports = router;