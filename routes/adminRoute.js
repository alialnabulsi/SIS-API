const express = require('express');
const AdminController = require('../controllers/adminController');
const { validateAdmin, validateAdminIDParam, validateUserIDParam } = require('../validators/adminDTO');

const router = express.Router();

router.post('/', validateAdmin, AdminController.createAdmin);
router.get('/:adminID', validateAdminIDParam, AdminController.getAdminByID);
router.get('/user/:userID', validateUserIDParam, AdminController.getAdminByUserID);
router.delete('/:adminID', validateAdminIDParam, AdminController.deleteAdmin);

module.exports = router;