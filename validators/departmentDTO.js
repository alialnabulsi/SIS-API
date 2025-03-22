const { body, param, validationResult } = require('express-validator');

// Validate department creation
const validateDepartment = [
    body('departmentID')
        .isString()
        .withMessage('Department ID must be a string')
        .notEmpty()
        .withMessage('Department ID is required')
        .isLength({ min: 1, max: 16 })
        .withMessage('Department ID must be between 1 and 16 characters'),

    body('facultyID')
        .isString()
        .withMessage('Faculty ID must be a string')
        .notEmpty()
        .withMessage('Faculty ID is required')
        .isLength({ min: 1, max: 16 })
        .withMessage('Faculty ID must be between 1 and 16 characters'),

    body('buildingID')
        .isInt({ min: 1 })
        .withMessage('Building ID must be a positive integer')
        .notEmpty()
        .withMessage('Building ID is required'),

    body('name')
        .isString()
        .withMessage('Department name must be a string')
        .notEmpty()
        .withMessage('Department name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Department name must be between 3 and 255 characters'),

    body('establishedYear')
        .isISO8601()
        .withMessage('Established year must be a valid date')
        .notEmpty()
        .withMessage('Established year is required'),

    body('contactEmail')
        .isEmail()
        .withMessage('Contact email must be a valid email address')
        .notEmpty()
        .withMessage('Contact email is required'),

    body('contactPhone')
        .isString()
        .withMessage('Contact phone must be a string')
        .notEmpty()
        .withMessage('Contact phone is required')
        .isLength({ min: 10, max: 15 })
        .withMessage('Contact phone must be between 10 and 15 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate department ID parameter in routes (for specific department lookup)
const validateDepartmentIDParam = [
    param('departmentID')
        .isString()
        .withMessage('Department ID must be a string')
        .notEmpty()
        .withMessage('Department ID is required')
        .isLength({ min: 1, max: 16 })
        .withMessage('Department ID must be between 1 and 16 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate department name parameter in routes (for specific department lookup by name)
const validateNameParam = [
    param('name')
        .isString()
        .withMessage('Department name must be a string')
        .notEmpty()
        .withMessage('Department name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Department name must be between 3 and 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate department update
const validateDepartmentUpdate = [
    param('departmentID')
        .isString()
        .withMessage('Department ID must be a string')
        .notEmpty()
        .withMessage('Department ID is required')
        .isLength({ min: 1, max: 16 })
        .withMessage('Department ID must be between 1 and 16 characters'),

    body('facultyID')
        .optional()
        .isString()
        .withMessage('Faculty ID must be a string')
        .isLength({ min: 1, max: 16 })
        .withMessage('Faculty ID must be between 1 and 16 characters'),

    body('buildingID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Building ID must be a positive integer'),

    body('name')
        .optional()
        .isString()
        .withMessage('Department name must be a string')
        .isLength({ min: 3, max: 255 })
        .withMessage('Department name must be between 3 and 255 characters'),

    body('establishedYear')
        .optional()
        .isISO8601()
        .withMessage('Established year must be a valid date'),

    body('contactEmail')
        .optional()
        .isEmail()
        .withMessage('Contact email must be a valid email address'),

    body('contactPhone')
        .optional()
        .isString()
        .withMessage('Contact phone must be a string')
        .isLength({ min: 10, max: 15 })
        .withMessage('Contact phone must be between 10 and 15 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateDepartment,
    validateDepartmentIDParam,
    validateNameParam,
    validateDepartmentUpdate
};