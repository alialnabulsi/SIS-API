const { body, param, validationResult } = require('express-validator');

// Validate course creation
const validateCourse = [
    body('courseID')
        .isString()
        .withMessage('Course ID must be a string')
        .notEmpty()
        .withMessage('Course ID is required'),

    body('name')
        .isString()
        .withMessage('Course name must be a string')
        .notEmpty()
        .withMessage('Course name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Course name must be between 3 and 255 characters'),

    body('credits')
        .isIn(['1', '2', '3', '4', '5'])
        .withMessage('Credits must be one of: 1, 2, 3, 4, 5')
        .notEmpty()
        .withMessage('Credits are required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate course ID parameter in routes (for specific course lookup)
const validateCourseIDParam = [
    param('courseID')
        .isString()
        .withMessage('Course ID must be a string')
        .notEmpty()
        .withMessage('Course ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate course name parameter in routes (for specific course lookup by name)
const validateNameParam = [
    param('name')
        .isString()
        .withMessage('Course name must be a string')
        .notEmpty()
        .withMessage('Course name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Course name must be between 3 and 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate course update
const validateCourseUpdate = [
    param('courseID')
        .isString()
        .withMessage('Course ID must be a string')
        .notEmpty()
        .withMessage('Course ID is required'),

    body('courseID')
        .optional()
        .isString()
        .withMessage('Course ID must be a string')
        .notEmpty()
        .withMessage('Course ID is required'),

    body('name')
        .optional()
        .isString()
        .withMessage('Course name must be a string')
        .isLength({ min: 3, max: 255 })
        .withMessage('Course name must be between 3 and 255 characters'),

    body('credits')
        .optional()
        .isIn(['1', '2', '3', '4', '5'])
        .withMessage('Credits must be one of: 1, 2, 3, 4, 5'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateCourse,
    validateCourseIDParam,
    validateNameParam,
    validateCourseUpdate
};