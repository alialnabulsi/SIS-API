const { body, param, validationResult } = require('express-validator');

// Validate campus creation
const validateCampus = [
    param('locationID')
        .isInt({ min: 1 })
        .withMessage('Location ID must be a positive integer')
        .notEmpty()
        .withMessage('Location ID is required'),

    body('name')
        .isString()
        .withMessage('Campus name must be a string')
        .notEmpty()
        .withMessage('Campus name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Campus name must be between 3 and 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate campus name (GET campus by name)
const validateNameParam = [
    param('name')
        .isString()
        .withMessage('Campus name must be a string')
        .notEmpty()
        .withMessage('Campus name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Campus name must be between 3 and 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateCampusIDParam = [
    param('campusId')
        .isInt()
        .withMessage('Campus ID must be a number')
        .notEmpty()
        .withMessage('Campus ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate campus update
const validateCampusUpdate = [
    param('name')
        .isString()
        .withMessage('Campus name must be a string')
        .notEmpty()
        .withMessage('Campus name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Campus name must be between 3 and 255 characters'),

    param('locationID')
        .isInt({ min: 1 })
        .withMessage('Location ID must be a positive integer')
        .notEmpty()
        .withMessage('Location ID is required'),

    body('name')
        .optional()
        .isString()
        .withMessage('Campus name must be a string')
        .isLength({ min: 3, max: 255 })
        .withMessage('Campus name must be between 3 and 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateCampus,
    validateCampusIDParam,
    validateNameParam,
    validateCampusUpdate
};
