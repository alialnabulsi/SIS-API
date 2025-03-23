const { body, param, validationResult } = require('express-validator');

// Validate final exam schedule creation
const validateFinalExamSchedule = [
    body('finalExamID')
        .isInt({ min: 1 })
        .withMessage('Final Exam ID must be a positive integer')
        .notEmpty()
        .withMessage('Final Exam ID is required'),

    body('scheduleID')
        .isInt({ min: 1 })
        .withMessage('Schedule ID must be a positive integer')
        .notEmpty()
        .withMessage('Schedule ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate final exam schedule ID parameter in routes
const validateFinalExamScheduleIDParam = [
    param('finalExamScheduleID')
        .isInt({ min: 1 })
        .withMessage('Final Exam Schedule ID must be a positive integer')
        .notEmpty()
        .withMessage('Final Exam Schedule ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate final exam schedule update
const validateFinalExamScheduleUpdate = [
    param('finalExamScheduleID')
        .isInt({ min: 1 })
        .withMessage('Final Exam Schedule ID must be a positive integer')
        .notEmpty()
        .withMessage('Final Exam Schedule ID is required'),

    body('finalExamID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Final Exam ID must be a positive integer'),

    body('scheduleID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Schedule ID must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateFinalExamSchedule,
    validateFinalExamScheduleIDParam,
    validateFinalExamScheduleUpdate
};