const { body, param, validationResult } = require('express-validator');

// Validate courseProgram creation
const validateCourseProgram = [
    body('courseID')
        .isString()
        .withMessage('Course ID must be a string')
        .notEmpty()
        .withMessage('Course ID is required'),

    body('programID')
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

// Validate courseProgram ID parameter in routes (for specific courseProgram lookup)
const validateCourseProgramIDParam = [
    param('courseProgramID')
        .isInt({ min: 1 })
        .withMessage('CourseProgram ID must be a positive integer')
        .notEmpty()
        .withMessage('CourseProgram ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate course and program parameters in routes (for specific courseProgram lookup by course and program)
const validateCourseAndProgramParams = [
    param('courseID')
        .isString()
        .withMessage('Course ID must be a string')
        .notEmpty()
        .withMessage('Course ID is required'),

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

// Validate courseProgram update
const validateCourseProgramUpdate = [
    param('courseProgramID')
        .isInt({ min: 1 })
        .withMessage('CourseProgram ID must be a positive integer')
        .notEmpty()
        .withMessage('CourseProgram ID is required'),

    body('courseID')
        .optional()
        .isString()
        .withMessage('Course ID must be a string'),

    body('programID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Program ID must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateCourseProgram,
    validateCourseProgramIDParam,
    validateCourseAndProgramParams,
    validateCourseProgramUpdate
};