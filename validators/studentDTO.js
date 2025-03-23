const { body, param, validationResult } = require('express-validator');

// Validate student creation
const validateStudent = [
    body('userID')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer')
        .notEmpty()
        .withMessage('User ID is required'),

    body('advisorID')
        .isString()
        .withMessage('Advisor ID must be a string')
        .notEmpty()
        .withMessage('Advisor ID is required'),

    body('programID')
        .isInt({ min: 1 })
        .withMessage('Program ID must be a positive integer')
        .notEmpty()
        .withMessage('Program ID is required'),

    body('status')
        .isIn(['active', 'inactive', 'graduated'])
        .withMessage('Status must be one of: active, inactive, graduated')
        .notEmpty()
        .withMessage('Status is required'),

    body('admissionYear')
        .isISO8601()
        .withMessage('Admission year must be a valid date')
        .notEmpty()
        .withMessage('Admission year is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate student ID parameter in routes (for specific student lookup)
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

// Validate user ID parameter in routes (for specific student lookup by userID)
const validateUserIDParam = [
    param('userID')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer')
        .notEmpty()
        .withMessage('User ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate student update
const validateStudentUpdate = [
    param('studentID')
        .isString()
        .withMessage('Student ID must be a string')
        .notEmpty()
        .withMessage('Student ID is required'),

    body('advisorID')
        .optional()
        .isString()
        .withMessage('Advisor ID must be a string'),

    body('programID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Program ID must be a positive integer'),

    body('status')
        .optional()
        .isIn(['active', 'inactive', 'graduated'])
        .withMessage('Status must be one of: active, inactive, graduated'),

    body('admissionYear')
        .optional()
        .isISO8601()
        .withMessage('Admission year must be a valid date'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateStudent,
    validateStudentIDParam,
    validateUserIDParam,
    validateStudentUpdate
};