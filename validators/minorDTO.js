const { body, param, validationResult } = require('express-validator');

// Validate minor creation
const validateMinor = [
    body('name')
        .isString()
        .withMessage('Minor name must be a string')
        .notEmpty()
        .withMessage('Minor name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Minor name must be between 3 and 255 characters'),

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

// Validate minor ID parameter in routes (for specific minor lookup)
const validateMinorIDParam = [
    param('minorID')
        .isInt({ min: 1 })
        .withMessage('Minor ID must be a positive integer')
        .notEmpty()
        .withMessage('Minor ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate minor name parameter in routes (for specific minor lookup by name)
const validateNameParam = [
    param('name')
        .isString()
        .withMessage('Minor name must be a string')
        .notEmpty()
        .withMessage('Minor name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Minor name must be between 3 and 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate minor update
const validateMinorUpdate = [
    param('minorID')
        .isInt({ min: 1 })
        .withMessage('Minor ID must be a positive integer')
        .notEmpty()
        .withMessage('Minor ID is required'),

    body('name')
        .optional()
        .isString()
        .withMessage('Minor name must be a string')
        .isLength({ min: 3, max: 255 })
        .withMessage('Minor name must be between 3 and 255 characters'),

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
    validateMinor,
    validateMinorIDParam,
    validateNameParam,
    validateMinorUpdate
};