const { body, param, validationResult } = require('express-validator');

// Validate instructor creation
const validateInstructor = [
    body('userID')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer')
        .notEmpty()
        .withMessage('User ID is required'),

    body('departmentID')
        .isString()
        .withMessage('Department ID must be a string')
        .notEmpty()
        .withMessage('Department ID is required'),

    body('hireDate')
        .isISO8601()
        .withMessage('Hire date must be a valid date')
        .notEmpty()
        .withMessage('Hire date is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate instructor ID parameter in routes
const validateInstructorIDParam = [
    param('instructorID')
        .isString()
        .withMessage('Instructor ID must be a string')
        .notEmpty()
        .withMessage('Instructor ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate user ID parameter in routes
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

// Validate department ID parameter in routes
const validateDepartmentIDParam = [
    param('departmentID')
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

module.exports = {
    validateInstructor,
    validateInstructorIDParam,
    validateUserIDParam,
    validateDepartmentIDParam
};