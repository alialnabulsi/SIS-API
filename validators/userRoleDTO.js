const { body, param, validationResult } = require('express-validator');

// Validate user-role creation
const validateUserRole = [
    body('userID')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer')
        .notEmpty()
        .withMessage('User ID is required'),

    body('roleID')
        .isInt({ min: 1 })
        .withMessage('Role ID must be a positive integer')
        .notEmpty()
        .withMessage('Role ID is required'),

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

// Validate role ID parameter in routes
const validateRoleIDParam = [
    param('roleID')
        .isInt({ min: 1 })
        .withMessage('Role ID must be a positive integer')
        .notEmpty()
        .withMessage('Role ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateUserRole,
    validateUserIDParam,
    validateRoleIDParam
};