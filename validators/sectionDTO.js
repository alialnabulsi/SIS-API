const { body, param, validationResult } = require('express-validator');

// Validate section creation
const validateSection = [
    body('courseID')
        .isString()
        .withMessage('Course ID must be a string')
        .notEmpty()
        .withMessage('Course ID is required'),

    body('scheduleID')
        .isInt({ min: 1 })
        .withMessage('Schedule ID must be a positive integer')
        .notEmpty()
        .withMessage('Schedule ID is required'),

    body('instructorID')
        .isString()
        .withMessage('Instructor ID must be a string')
        .notEmpty()
        .withMessage('Instructor ID is required'),

    body('finalExamScheduleID')
        .isInt({ min: 1 })
        .withMessage('Final Exam Schedule ID must be a positive integer')
        .notEmpty()
        .withMessage('Final Exam Schedule ID is required'),

    body('semesterID')
        .isInt({ min: 1 })
        .withMessage('Semester ID must be a positive integer')
        .notEmpty()
        .withMessage('Semester ID is required'),

    body('sectionCapacity')
        .isInt({ min: 1 })
        .withMessage('Section capacity must be a positive integer')
        .notEmpty()
        .withMessage('Section capacity is required'),

    body('enrolled')
        .isInt({ min: 0 })
        .withMessage('Enrolled must be a non-negative integer')
        .notEmpty()
        .withMessage('Enrolled is required'),

    body('language')
        .isIn(['Arabic', 'English', 'French'])
        .withMessage('Language must be one of: Arabic, English, French')
        .notEmpty()
        .withMessage('Language is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate section ID parameter in routes
const validateSectionIDParam = [
    param('sectionID')
        .isInt({ min: 1 })
        .withMessage('Section ID must be a positive integer')
        .notEmpty()
        .withMessage('Section ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate section update
const validateSectionUpdate = [
    param('sectionID')
        .isInt({ min: 1 })
        .withMessage('Section ID must be a positive integer')
        .notEmpty()
        .withMessage('Section ID is required'),

    body('courseID')
        .optional()
        .isString()
        .withMessage('Course ID must be a string'),

    body('scheduleID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Schedule ID must be a positive integer'),

    body('instructorID')
        .optional()
        .isString()
        .withMessage('Instructor ID must be a string'),

    body('finalExamScheduleID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Final Exam Schedule ID must be a positive integer'),

    body('semesterID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Semester ID must be a positive integer'),

    body('sectionCapacity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Section capacity must be a positive integer'),

    body('enrolled')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Enrolled must be a non-negative integer'),

    body('language')
        .optional()
        .isIn(['Arabic', 'English', 'French'])
        .withMessage('Language must be one of: Arabic, English, French'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateSection,
    validateSectionIDParam,
    validateSectionUpdate
};