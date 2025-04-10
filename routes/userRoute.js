const express = require('express');
const UserController = require('../controllers/userController');
const { validateUser, validateUserIDParam, validateUsernameParam, validateUserUpdate, validateLogin,validateResetPassword} = require('../validators/userDTO');

const router = express.Router();

router.post('/', validateUser, UserController.createUser);
router.get('/:username', validateUsernameParam, UserController.getUser);
router.get('/id/:userID', validateUserIDParam, UserController.getUserByID);
router.get('/', UserController.getAllUsers);
router.get('/find/search', UserController.searchUsers);
router.put('/:userID', validateUserUpdate, UserController.updateUser);
router.delete('/:username', validateUsernameParam, UserController.deleteUser);
router.delete('/', UserController.deleteAllUsers);
router.post('/login', validateLogin, UserController.loginUser);
router.post('/:userID/reset-password', validateUserIDParam, validateResetPassword, UserController.resetPassword);
router.post('/:userID/lock', validateUserIDParam, UserController.lockAccount);
router.post('/:userID/unlock', validateUserIDParam, UserController.unlockAccount);
module.exports = router;