const { body, param, validationResult } = require('express-validator');

// Validate program creation
const validateProgram = [
    body('name')
        .isString()
        .withMessage('Program name must be a string')
        .notEmpty()
        .withMessage('Program name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Program name must be between 3 and 255 characters'),

    body('majorID')
        .isInt({ min: 1 })
        .withMessage('Major ID must be a positive integer')
        .notEmpty()
        .withMessage('Major ID is required'),

    body('minorID')
        .isInt({ min: 1 })
        .withMessage('Minor ID must be a positive integer')
        .notEmpty()
        .withMessage('Minor ID is required'),

    body('programType')
        .isIn(['undergraduate', 'graduate'])
        .withMessage('Program type must be either "undergraduate" or "graduate"')
        .notEmpty()
        .withMessage('Program type is required'),

    body('requirements')
        .isString()
        .withMessage('Requirements must be a string')
        .notEmpty()
        .withMessage('Requirements are required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate program ID parameter in routes (for specific program lookup)
const validateProgramIDParam = [
    param('programID')
        .isInt({ min: 1 })
        .withMessage('Program ID must be a positive integer')
        .notEmpty()
        .withMessage('Program ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate program name parameter in routes (for specific program lookup by name)
const validateNameParam = [
    param('name')
        .isString()
        .withMessage('Program name must be a string')
        .notEmpty()
        .withMessage('Program name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Program name must be between 3 and 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate program update
const validateProgramUpdate = [
    param('programID')
        .isInt({ min: 1 })
        .withMessage('Program ID must be a positive integer')
        .notEmpty()
        .withMessage('Program ID is required'),

    body('name')
        .optional()
        .isString()
        .withMessage('Program name must be a string')
        .isLength({ min: 3, max: 255 })
        .withMessage('Program name must be between 3 and 255 characters'),

    body('majorID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Major ID must be a positive integer'),

    body('minorID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Minor ID must be a positive integer'),

    body('programType')
        .optional()
        .isIn(['undergraduate', 'graduate'])
        .withMessage('Program type must be either "undergraduate" or "graduate"'),

    body('requirements')
        .optional()
        .isString()
        .withMessage('Requirements must be a string'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateProgram,
    validateProgramIDParam,
    validateNameParam,
    validateProgramUpdate
};