const { body, param, validationResult } = require('express-validator');

// Validate faculty creation
const validateFaculty = [
    body('facultyID')
        .isString()
        .withMessage('Faculty ID must be a string')
        .notEmpty()
        .withMessage('Faculty ID is required')
        .isLength({ min: 1, max: 16 })
        .withMessage('Faculty ID must be between 1 and 16 characters'),

    body('name')
        .isString()
        .withMessage('Faculty name must be a string')
        .notEmpty()
        .withMessage('Faculty name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Faculty name must be between 3 and 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate faculty ID parameter in routes (for specific faculty lookup)
const validateFacultyIDParam = [
    param('facultyID')
        .isString()
        .withMessage('Faculty ID must be a string')
        .notEmpty()
        .withMessage('Faculty ID is required')
        .isLength({ min: 1, max: 16 })
        .withMessage('Faculty ID must be between 1 and 16 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate faculty name parameter in routes (for specific faculty lookup by name)
const validateNameParam = [
    param('name')
        .isString()
        .withMessage('Faculty name must be a string')
        .notEmpty()
        .withMessage('Faculty name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Faculty name must be between 3 and 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate faculty update
const validateFacultyUpdate = [
    param('facultyID')
        .isString()
        .withMessage('Faculty ID must be a string')
        .notEmpty()
        .withMessage('Faculty ID is required')
        .isLength({ min: 1, max: 16 })
        .withMessage('Faculty ID must be between 1 and 16 characters'),
    body('facultyID')
        .optional()
        .isString()
        .withMessage('Faculty ID must be a string')
        .notEmpty()
        .withMessage('Faculty ID is required')
        .isLength({ min: 1, max: 16 })
        .withMessage('Faculty ID must be between 1 and 16 characters'),
    body('name')
        .optional()
        .isString()
        .withMessage('Faculty name must be a string')
        .isLength({ min: 3, max: 255 })
        .withMessage('Faculty name must be between 3 and 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateFaculty,
    validateFacultyIDParam,
    validateNameParam,
    validateFacultyUpdate
};