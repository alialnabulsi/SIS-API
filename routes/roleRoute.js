const express = require('express');
const RoleController = require('../controllers/roleController');
const { validateRole, validateRoleIDParam, validateRoleNameParam, validateRoleUpdate } = require('../validators/roleDTO');

const router = express.Router();

router.post('/', validateRole, RoleController.createRole);
router.get('/:roleName', validateRoleNameParam, RoleController.getRole);
router.get('/id/:roleID', validateRoleIDParam, RoleController.getRoleByID);
router.get('/', RoleController.getAllRoles);
router.put('/:roleName', validateRoleUpdate, RoleController.updateRole);
router.delete('/:roleName', validateRoleNameParam, RoleController.deleteRole);
router.delete('/', RoleController.deleteAllRoles);

module.exports = router;