const { body, param, validationResult } = require('express-validator');

// Validate hold creation
const validateHold = [
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

const validateHoldUpdate = [
    param('holdID')
        .isInt({ min: 1 })
        .withMessage('Hold ID must be a positive integer')
        .notEmpty()
        .withMessage('Hold ID is required'),

    body('holdID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Hold ID must be a positive integer')
        .notEmpty()
        .withMessage('Hold ID is required'),

    body('reason')
        .optional()
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



module.exports = {
    validateHold,
    validateHoldIDParam,
    validateHoldUpdate
};