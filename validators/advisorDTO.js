const { body, param, validationResult } = require('express-validator');

// Validate advisor creation
const validateAdvisor = [
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

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate advisor ID parameter in routes
const validateAdvisorIDParam = [
    param('advisorID')
        .isString()
        .withMessage('Advisor ID must be a string')
        .notEmpty()
        .withMessage('Advisor ID is required'),

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
    validateAdvisor,
    validateAdvisorIDParam,
    validateUserIDParam,
    validateDepartmentIDParam
};