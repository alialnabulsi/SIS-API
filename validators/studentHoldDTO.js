const { body, param, validationResult } = require('express-validator');

// Validate studentHold creation
const validateStudentHold = [
    body('studentID')
        .isString()
        .withMessage('Student ID must be a string')
        .notEmpty()
        .withMessage('Student ID is required'),

    body('holdID')
        .isInt({ min: 1 })
        .withMessage('Hold ID must be a positive integer')
        .notEmpty()
        .withMessage('Hold ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate studentHold ID parameter in routes (for specific studentHold lookup)
const validateStudentHoldIDParam = [
    param('studentHoldID')
        .isInt({ min: 1 })
        .withMessage('StudentHold ID must be a positive integer')
        .notEmpty()
        .withMessage('StudentHold ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate student and hold parameters in routes (for specific studentHold lookup by student and hold)
const validateStudentAndHoldParams = [
    param('studentID')
        .isString()
        .withMessage('Student ID must be a string')
        .notEmpty()
        .withMessage('Student ID is required'),

    param('holdID')
        .isInt({ min: 1 })
        .withMessage('Hold ID must be a positive integer')
        .notEmpty()
        .withMessage('Hold ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate studentHold update
const validateStudentHoldUpdate = [
    param('studentHoldID')
        .isInt({ min: 1 })
        .withMessage('StudentHold ID must be a positive integer')
        .notEmpty()
        .withMessage('StudentHold ID is required'),

    body('studentID')
        .optional()
        .isString()
        .withMessage('Student ID must be a string'),

    body('holdID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Hold ID must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateStudentHold,
    validateStudentHoldIDParam,
    validateStudentAndHoldParams,
    validateStudentHoldUpdate
};