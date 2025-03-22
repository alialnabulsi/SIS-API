const { body, param, validationResult } = require('express-validator');

// Validate admin creation
const validateAdmin = [
    body('userID')
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

// Validate admin ID parameter in routes
const validateAdminIDParam = [
    param('adminID')
        .isString()
        .withMessage('Admin ID must be a string')
        .notEmpty()
        .withMessage('Admin ID is required'),

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

module.exports = {
    validateAdmin,
    validateAdminIDParam,
    validateUserIDParam
};