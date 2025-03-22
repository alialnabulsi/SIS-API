const express = require('express');
const UserRoleController = require('../controllers/userRoleController');
const { validateUserRole, validateUserIDParam, validateRoleIDParam } = require('../validators/userRoleDTO');

const router = express.Router();

router.post('/', validateUserRole, UserRoleController.createUserRole);
router.get('/user/:userID', validateUserIDParam, UserRoleController.getUserRolesByUserID);
router.get('/role/:roleID', validateRoleIDParam, UserRoleController.getUserRolesByRoleID);
router.delete('/:userID/:roleID', validateUserIDParam, validateRoleIDParam, UserRoleController.deleteUserRole);
router.delete('/user/:userID', validateUserIDParam, UserRoleController.deleteAllRolesForUser);
router.delete('/role/:roleID', validateRoleIDParam, UserRoleController.deleteAllUsersForRole);

module.exports = router;