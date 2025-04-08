const { body, param, validationResult } = require('express-validator');

// Validate user creation
const validateUser = [
    body('username')
        .isString()
        .withMessage('Username must be a string')
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 12 })
        .withMessage('Username must be between 3 and 12 characters'),

    body('password')
        .isString()
        .withMessage('Password must be a string')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),

    body('firstName')
        .isString()
        .withMessage('First name must be a string')
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 255 })
        .withMessage('First name must be between 2 and 255 characters'),

    body('lastName')
        .isString()
        .withMessage('Last name must be a string')
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 255 })
        .withMessage('Last name must be between 2 and 255 characters'),

    body('dateOfBirth')
        .isISO8601()
        .withMessage('Date of birth must be a valid date')
        .notEmpty()
        .withMessage('Date of birth is required'),

    body('email')
        .isEmail()
        .withMessage('Email must be a valid email address')
        .notEmpty()
        .withMessage('Email is required'),

    body('profilePicture')
        .optional()
        .isString()
        .withMessage('Profile picture must be a string'),

    body('createdAt')
        .isISO8601()
        .withMessage('Created at must be a valid date')
        .notEmpty()
        .withMessage('Created at is required'),

    body('updatedAt')
        .isISO8601()
        .withMessage('Updated at must be a valid date')
        .notEmpty()
        .withMessage('Updated at is required'),

    body('lastLogin')
        .isISO8601()
        .withMessage('Last login must be a valid date')
        .notEmpty()
        .withMessage('Last login is required'),

    body('city')
        .optional()
        .isString()
        .withMessage('City must be a string'),

    body('zipCode')
        .optional()
        .isString()
        .withMessage('Zip code must be a string'),

    body('street')
        .optional()
        .isString()
        .withMessage('Street must be a string'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate user ID parameter in routes (for specific user lookup)
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

// Validate username parameter in routes (for specific user lookup by username)
const validateUsernameParam = [
    param('username')
        .isString()
        .withMessage('Username must be a string')
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 12 })
        .withMessage('Username must be between 3 and 12 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate user update
const validateUserUpdate = [
    param('userID')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer')
        .notEmpty()
        .withMessage('User ID is required'),

    body('userID')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer')
        .notEmpty()
        .withMessage('User ID is required'),

    body('username')
        .optional()
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 3, max: 12 })
        .withMessage('Username must be between 3 and 12 characters'),

    body('password')
        .optional()
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),

    body('firstName')
        .optional()
        .isString()
        .withMessage('First name must be a string')
        .isLength({ min: 2, max: 255 })
        .withMessage('First name must be between 2 and 255 characters'),

    body('lastName')
        .optional()
        .isString()
        .withMessage('Last name must be a string')
        .isLength({ min: 2, max: 255 })
        .withMessage('Last name must be between 2 and 255 characters'),

    body('dateOfBirth')
        .optional()
        .isISO8601()
        .withMessage('Date of birth must be a valid date'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Email must be a valid email address'),

    body('profilePicture')
        .optional()
        .isString()
        .withMessage('Profile picture must be a string'),

    body('createdAt')
        .optional()
        .isISO8601()
        .withMessage('Created at must be a valid date'),

    body('updatedAt')
        .optional()
        .isISO8601()
        .withMessage('Updated at must be a valid date'),

    body('lastLogin')
        .optional()
        .isISO8601()
        .withMessage('Last login must be a valid date'),

    body('city')
        .optional()
        .isString()
        .withMessage('City must be a string'),

    body('zipCode')
        .optional()
        .isString()
        .withMessage('Zip code must be a string'),

    body('street')
        .optional()
        .isString()
        .withMessage('Street must be a string'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateUser,
    validateUserIDParam,
    validateUsernameParam,
    validateUserUpdate
};