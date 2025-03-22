const { body, param, validationResult } = require('express-validator');

// Validate phone number creation
const validatePhoneNumber = [
    body('userID')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer')
        .notEmpty()
        .withMessage('User ID is required'),

    body('phoneNumber')
        .isString()
        .withMessage('Phone number must be a string')
        .notEmpty()
        .withMessage('Phone number is required')
        .isLength({ min: 10, max: 16 })
        .withMessage('Phone number must be between 10 and 16 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate phone number ID parameter in routes (for specific phone number lookup)
const validatePhoneNumberIDParam = [
    param('phoneNumberID')
        .isInt({ min: 1 })
        .withMessage('Phone number ID must be a positive integer')
        .notEmpty()
        .withMessage('Phone number ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate phone number parameter in routes (for specific phone number lookup by phone number)
const validatePhoneNumberParam = [
    param('phoneNumber')
        .isString()
        .withMessage('Phone number must be a string')
        .notEmpty()
        .withMessage('Phone number is required')
        .isLength({ min: 10, max: 16 })
        .withMessage('Phone number must be between 10 and 16 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate phone number update
const validatePhoneNumberUpdate = [
    param('phoneNumberID')
        .isInt({ min: 1 })
        .withMessage('Phone number ID must be a positive integer')
        .notEmpty()
        .withMessage('Phone number ID is required'),

    body('userID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),

    body('phoneNumber')
        .optional()
        .isString()
        .withMessage('Phone number must be a string')
        .isLength({ min: 10, max: 16 })
        .withMessage('Phone number must be between 10 and 16 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validatePhoneNumber,
    validatePhoneNumberIDParam,
    validatePhoneNumberParam,
    validatePhoneNumberUpdate
};