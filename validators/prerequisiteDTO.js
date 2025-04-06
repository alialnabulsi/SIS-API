const { body, param, validationResult } = require('express-validator');

// Validate prerequisite creation
const validatePrerequisite = [
    body('courseID')
        .isString()
        .withMessage('Course ID must be a string')
        .notEmpty()
        .withMessage('Course ID is required'),

    body('prerequisiteID')
        .isString()
        .withMessage('Prerequisite ID must be a string')
        .notEmpty()
        .withMessage('Prerequisite ID is required'),

    body('prerequisiteType')
        .isIn(['Corequisite', 'Prerequisite'])
        .withMessage('Prerequisite type must be either "Corequisite" or "Prerequisite"')
        .notEmpty()
        .withMessage('Prerequisite type is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate prerequisite ID parameter in routes (for specific prerequisite lookup)
const validatePrerequisiteIDParam = [
    param('prerequisiteCourseID')
        .isInt({ min: 1 })
        .withMessage('Prerequisite ID must be a positive integer')
        .notEmpty()
        .withMessage('Prerequisite ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate course and prerequisite parameters in routes (for specific prerequisite lookup by course and prerequisite)
const validateCourseAndPrerequisiteParams = [
    param('courseID')
        .isString()
        .withMessage('Course ID must be a string')
        .notEmpty()
        .withMessage('Course ID is required'),

    param('prerequisiteID')
        .isString()
        .withMessage('Prerequisite ID must be a string')
        .notEmpty()
        .withMessage('Prerequisite ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate prerequisite update
const validatePrerequisiteUpdate = [
    param('prerequisiteCourseID')
        .isInt({ min: 1 })
        .withMessage('Prerequisite ID must be a positive integer')
        .notEmpty()
        .withMessage('Prerequisite ID is required'),

    body('prerequisiteCourseID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Prerequisite ID must be a positive integer')
        .notEmpty()
        .withMessage('Prerequisite ID is required'),


    body('courseID')
        .optional()
        .isString()
        .withMessage('Course ID must be a string'),

    body('prerequisiteID')
        .optional()
        .isString()
        .withMessage('Prerequisite ID must be a string'),

    body('prerequisiteType')
        .optional()
        .isIn(['Corequisite', 'Prerequisite'])
        .withMessage('Prerequisite type must be either "Corequisite" or "Prerequisite"'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validatePrerequisite,
    validatePrerequisiteIDParam,
    validateCourseAndPrerequisiteParams,
    validatePrerequisiteUpdate
};