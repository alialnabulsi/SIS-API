const { body, param, validationResult } = require('express-validator');

// Validate finalExam creation
const validateFinalExam = [
    body('courseID')
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

// Validate finalExam ID parameter in routes (for specific finalExam lookup)
const validateFinalExamIDParam = [
    param('finalExamID')
        .isInt({ min: 1 })
        .withMessage('FinalExam ID must be a positive integer')
        .notEmpty()
        .withMessage('FinalExam ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate course ID parameter in routes (for specific finalExam lookup by course)
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

// Validate finalExam update
const validateFinalExamUpdate = [
    param('finalExamID')
        .isInt({ min: 1 })
        .withMessage('FinalExam ID must be a positive integer')
        .notEmpty()
        .withMessage('FinalExam ID is required'),

    body('courseID')
        .optional()
        .isString()
        .withMessage('Course ID must be a string'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateFinalExam,
    validateFinalExamIDParam,
    validateCourseIDParam,
    validateFinalExamUpdate
};