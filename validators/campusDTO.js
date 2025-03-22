const { body, param, validationResult } = require('express-validator');

// Validate campus creation
const validateCampus = [
    body('campusName')
        .isString()
        .withMessage('Campus name must be a string')
        .notEmpty()
        .withMessage('Campus name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Campus name must be between 3 and 255 characters'),

    body('city')
        .isString()
        .withMessage('City must be a string')
        .notEmpty()
        .withMessage('City is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('City name must be between 3 and 255 characters'),

    body('address')
        .isString()
        .withMessage('Address must be a string')
        .notEmpty()
        .withMessage('Address is required')
        .isLength({ min: 5, max: 255 })
        .withMessage('Address must be between 5 and 255 characters'),

    body('zipCode')
        .optional()
        .isString()
        .withMessage('Zip Code must be a string')
        .isLength({ max: 255 })
        .withMessage('Zip Code must not be longer than 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate campus ID (GET campus by ID)
const validateCampusParam = [
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
    param('campusId')
        .isInt()
        .withMessage('Campus ID must be a number')
        .notEmpty()
        .withMessage('Campus ID is required'),

    body('campusName')
        .optional()
        .isString()
        .withMessage('Campus name must be a string')
        .isLength({ min: 3, max: 255 })
        .withMessage('Campus name must be between 3 and 255 characters'),

    body('city')
        .optional()
        .isString()
        .withMessage('City must be a string')
        .isLength({ min: 3, max: 255 })
        .withMessage('City name must be between 3 and 255 characters'),

    body('address')
        .optional()
        .isString()
        .withMessage('Address must be a string')
        .isLength({ min: 5, max: 255 })
        .withMessage('Address must be between 5 and 255 characters'),

    body('zipCode')
        .optional()
        .isString()
        .withMessage('Zip Code must be a string')
        .isLength({ max: 255 })
        .withMessage('Zip Code must not be longer than 255 characters'),

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
    validateCampusParam,
    validateCampusUpdate
};
