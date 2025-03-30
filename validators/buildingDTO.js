const { body, param, validationResult } = require('express-validator');

// Validate building creation
const validateBuilding = [
    body('name')
        .isString()
        .withMessage('Building name must be a string')
        .notEmpty()
        .withMessage('Building name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Building name must be between 3 and 255 characters'),

    body('campusID')
        .isInt({ min: 1 })
        .withMessage('Campus ID must be a positive integer')
        .notEmpty()
        .withMessage('Campus ID is required'),

    body('numberOfFloors')
        .isInt({ min: 1 })
        .withMessage('Number of Floors must be a positive integer')
        .notEmpty()
        .withMessage('Number of Floors is required'),


    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate building ID parameter in routes (for specific building lookup)
const validateBuildingIDParam = [
    param('buildingID')
        .isInt({ min: 1 })
        .withMessage('Building ID must be a positive integer')
        .notEmpty()
        .withMessage('Building ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate building name parameter in routes (for specific building lookup by name)
const validateNameParam = [
    param('name')
        .isString()
        .withMessage('Building name must be a string')
        .notEmpty()
        .withMessage('Building name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Building name must be between 3 and 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate building update
const validateBuildingUpdate = [

    param('name')
        .optional()
        .isString()
        .withMessage('Building name must be a string')
        .isLength({ min: 3, max: 255 })
        .withMessage('Building name must be between 3 and 255 characters'),
    body('name')
        .optional()
        .isString()
        .withMessage('Building name must be a string')
        .isLength({ min: 3, max: 255 })
        .withMessage('Building name must be between 3 and 255 characters'),
    body('campusID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Campus ID must be a positive integer'),

    body('numberOfFloors')
        .isInt({ min: 1 })
        .withMessage('Number of Floors must be a positive integer')
        .notEmpty()
        .withMessage('Number of Floors is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateBuilding,
    validateBuildingIDParam,
    validateNameParam,
    validateBuildingUpdate
};
