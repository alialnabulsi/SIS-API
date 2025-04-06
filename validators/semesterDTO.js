const { body, param, validationResult } = require('express-validator');

// Validate semester creation
const validateSemester = [
    body('name')
        .isIn(['spring', 'fall', 'summer'])
        .withMessage('Semester name must be one of: spring, fall, summer')
        .notEmpty()
        .withMessage('Semester name is required'),

    body('year')
        .isInt({ min: 1900, max: 2100 })
        .withMessage('Year must be a valid year between 1900 and 2100')
        .notEmpty()
        .withMessage('Year is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate semester ID parameter in routes (for specific semester lookup)
const validateSemesterIDParam = [
    param('semesterID')
        .isInt({ min: 1 })
        .withMessage('Semester ID must be a positive integer')
        .notEmpty()
        .withMessage('Semester ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate name and year parameters in routes (for specific semester lookup by name and year)
const validateNameAndYearParams = [
    param('name')
        .isIn(['spring', 'fall', 'summer'])
        .withMessage('Semester name must be one of: spring, fall, summer')
        .notEmpty()
        .withMessage('Semester name is required'),

    param('year')
        .isInt({ min: 1900, max: 2100 })
        .withMessage('Year must be a valid year between 1900 and 2100')
        .notEmpty()
        .withMessage('Year is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate semester update
const validateSemesterUpdate = [
    param('semesterID')
        .isInt({ min: 1 })
        .withMessage('Semester ID must be a positive integer')
        .notEmpty()
        .withMessage('Semester ID is required'),

    body('semesterID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Semester ID must be a positive integer')
        .notEmpty()
        .withMessage('Semester ID is required'),

    body('name')
        .optional()
        .isIn(['spring', 'fall', 'summer'])
        .withMessage('Semester name must be one of: spring, fall, summer'),

    body('year')
        .optional()
        .isInt({ min: 1900, max: 2100 })
        .withMessage('Year must be a valid year between 1900 and 2100'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateSemester,
    validateSemesterIDParam,
    validateNameAndYearParams,
    validateSemesterUpdate
};