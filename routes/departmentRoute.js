const express = require('express');
const DepartmentController = require('../controllers/departmentController');
const { validateDepartment, validateDepartmentIDParam, validateNameParam, validateDepartmentUpdate } = require('../validators/departmentDTO');

const router = express.Router();

router.post('/', validateDepartment, DepartmentController.createDepartment);
router.get('/:name', validateNameParam, DepartmentController.getDepartment);
router.get('/id/:departmentID', validateDepartmentIDParam, DepartmentController.getDepartmentByID);
router.get('/', DepartmentController.getAllDepartments);
router.put('/:departmentID', validateDepartmentUpdate, DepartmentController.updateDepartment);
router.delete('/:name', validateNameParam, DepartmentController.deleteDepartment);
router.delete('/', DepartmentController.deleteAllDepartments);

module.exports = router;