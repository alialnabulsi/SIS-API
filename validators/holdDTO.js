const { body, param, validationResult } = require('express-validator');

// Validate hold creation
const validateHold = [
    body('studentID')
        .isString()
        .withMessage('Student ID must be a string')
        .notEmpty()
        .withMessage('Student ID is required'),

    body('semesterID')
        .isInt({ min: 1 })
        .withMessage('Semester ID must be a positive integer')
        .notEmpty()
        .withMessage('Semester ID is required'),

    body('reason')
        .isString()
        .withMessage('Reason must be a string')
        .notEmpty()
        .withMessage('Reason is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate hold ID parameter in routes
const validateHoldIDParam = [
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

// Validate student ID parameter in routes
const validateStudentIDParam = [
    param('studentID')
        .isString()
        .withMessage('Student ID must be a string')
        .notEmpty()
        .withMessage('Student ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate semester ID parameter in routes
const validateSemesterIDParam = [
    param('semesterID')
        .isInt({ min: 1 })
        .withMessage('Semester ID must be a positive integer')
        .notEmpty()
        .withMessage('Semester ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateHold,
    validateHoldIDParam,
    validateStudentIDParam,
    validateSemesterIDParam
};