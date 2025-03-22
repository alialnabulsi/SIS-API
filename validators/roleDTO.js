const { body, param, validationResult } = require('express-validator');

// Validate role creation
const validateRole = [
    body('roleName')
        .isString()
        .withMessage('Role name must be a string')
        .notEmpty()
        .withMessage('Role name is required')
        .isIn(['Admin', 'Advisor', 'Instructor', 'Student'])
        .withMessage('Invalid role name'),

    body('roleDescription')
        .isString()
        .withMessage('Role description must be a string')
        .notEmpty()
        .withMessage('Role description is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate role ID parameter in routes (for specific role lookup)
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

// Validate role name parameter in routes (for specific role lookup by role name)
const validateRoleNameParam = [
    param('roleName')
        .isString()
        .withMessage('Role name must be a string')
        .notEmpty()
        .withMessage('Role name is required')
        .isIn(['Admin', 'Advisor', 'Instructor', 'Student'])
        .withMessage('Invalid role name'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate role update
const validateRoleUpdate = [
    param('roleID')
        .isInt({ min: 1 })
        .withMessage('Role ID must be a positive integer')
        .notEmpty()
        .withMessage('Role ID is required'),

    body('roleName')
        .optional()
        .isString()
        .withMessage('Role name must be a string')
        .isIn(['Admin', 'Advisor', 'Instructor', 'Student'])
        .withMessage('Invalid role name'),

    body('roleDescription')
        .optional()
        .isString()
        .withMessage('Role description must be a string'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateRole,
    validateRoleIDParam,
    validateRoleNameParam,
    validateRoleUpdate
};