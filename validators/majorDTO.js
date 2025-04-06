const { body, param, validationResult } = require('express-validator');

// Validate major creation
const validateMajor = [
    body('name')
        .isString()
        .withMessage('Major name must be a string')
        .notEmpty()
        .withMessage('Major name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Major name must be between 3 and 255 characters'),

    body('departmentID')
        .isString()
        .withMessage('Department ID must be a string')
        .notEmpty()
        .withMessage('Department ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate major ID parameter in routes (for specific major lookup)
const validateMajorIDParam = [
    param('majorID')
        .isInt({ min: 1 })
        .withMessage('Major ID must be a positive integer')
        .notEmpty()
        .withMessage('Major ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate major name parameter in routes (for specific major lookup by name)
const validateNameParam = [
    param('name')
        .isString()
        .withMessage('Major name must be a string')
        .notEmpty()
        .withMessage('Major name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Major name must be between 3 and 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate major update
const validateMajorUpdate = [
    param('majorID')
        .isInt({ min: 1 })
        .withMessage('Major ID must be a positive integer')
        .notEmpty()
        .withMessage('Major ID is required'),

    body('majorID')
        .isInt({ min: 1 })
        .withMessage('Major ID must be a positive integer')
        .notEmpty()
        .withMessage('Major ID is required'),

    body('name')
        .optional()
        .isString()
        .withMessage('Major name must be a string')
        .isLength({ min: 3, max: 255 })
        .withMessage('Major name must be between 3 and 255 characters'),

    body('departmentID')
        .optional()
        .isString()
        .withMessage('Department ID must be a string'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateMajor,
    validateMajorIDParam,
    validateNameParam,
    validateMajorUpdate
};