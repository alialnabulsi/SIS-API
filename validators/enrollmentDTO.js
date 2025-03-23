const { body, param, validationResult } = require('express-validator');

// Validate enrollment creation
const validateEnrollment = [
    body('studentID')
        .isString()
        .withMessage('Student ID must be a string')
        .notEmpty()
        .withMessage('Student ID is required'),

    body('sectionID')
        .isInt({ min: 1 })
        .withMessage('Section ID must be a positive integer')
        .notEmpty()
        .withMessage('Section ID is required'),

    body('courseID')
        .isString()
        .withMessage('Course ID must be a string')
        .notEmpty()
        .withMessage('Course ID is required'),

    body('status')
        .isIn(['Not Registered', 'Fail', 'Withdraw', 'Incomplete', 'Registered', 'Completed'])
        .withMessage('Status must be one of: Not Registered, Fail, Withdraw, Incomplete, Registered, Completed')
        .notEmpty()
        .withMessage('Status is required'),

    body('enrollmentDate')
        .isISO8601()
        .withMessage('Enrollment date must be a valid date')
        .notEmpty()
        .withMessage('Enrollment date is required'),

    body('grade')
        .isInt({ min: 0, max: 100 })
        .withMessage('Grade must be an integer between 0 and 100')
        .notEmpty()
        .withMessage('Grade is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate enrollment ID parameter in routes
const validateEnrollmentIDParam = [
    param('enrollmentID')
        .isInt({ min: 1 })
        .withMessage('Enrollment ID must be a positive integer')
        .notEmpty()
        .withMessage('Enrollment ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate enrollment update
const validateEnrollmentUpdate = [
    param('enrollmentID')
        .isInt({ min: 1 })
        .withMessage('Enrollment ID must be a positive integer')
        .notEmpty()
        .withMessage('Enrollment ID is required'),

    body('studentID')
        .optional()
        .isString()
        .withMessage('Student ID must be a string'),

    body('sectionID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Section ID must be a positive integer'),

    body('courseID')
        .optional()
        .isString()
        .withMessage('Course ID must be a string'),

    body('status')
        .optional()
        .isIn(['Not Registered', 'Fail', 'Withdraw', 'Incomplete', 'Registered', 'Completed'])
        .withMessage('Status must be one of: Not Registered, Fail, Withdraw, Incomplete, Registered, Completed'),

    body('enrollmentDate')
        .optional()
        .isISO8601()
        .withMessage('Enrollment date must be a valid date'),

    body('grade')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('Grade must be an integer between 0 and 100'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateEnrollment,
    validateEnrollmentIDParam,
    validateEnrollmentUpdate
};