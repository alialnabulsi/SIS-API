const { body, param, validationResult } = require('express-validator');

// Validate schedule creation
const validateSchedule = [
    body('roomID')
        .isInt({ min: 1 })
        .withMessage('Room ID must be a positive integer')
        .notEmpty()
        .withMessage('Room ID is required'),

    body('startTime')
        .isISO8601()
        .withMessage('Start time must be a valid date')
        .notEmpty()
        .withMessage('Start time is required'),

    body('endTime')
        .isISO8601()
        .withMessage('End time must be a valid date')
        .notEmpty()
        .withMessage('End time is required'),

    body('day')
        .isISO8601()
        .withMessage('Day must be a valid date')
        .notEmpty()
        .withMessage('Day is required'),

    body('scheduleType')
        .isIn(['LECTURE', 'LAB', 'SEMINAR', 'TUTORIAL', 'EXAM', 'OFFICE_HOURS', 'STUDY_SESSION', 'FACULTY_MEETING', 'CONFERENCE', 'WORKSHOP', 'GUEST_LECTURE', 'SPORTS_EVENT', 'LIBRARY_BOOKING'])
        .withMessage('Schedule type must be one of: LECTURE, LAB, SEMINAR, TUTORIAL, EXAM, OFFICE_HOURS, STUDY_SESSION, FACULTY_MEETING, CONFERENCE, WORKSHOP, GUEST_LECTURE, SPORTS_EVENT, LIBRARY_BOOKING')
        .notEmpty()
        .withMessage('Schedule type is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate schedule ID parameter in routes (for specific schedule lookup)
const validateScheduleIDParam = [
    param('scheduleID')
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

// Validate room and time parameters in routes (for specific schedule lookup by room and time)
const validateRoomAndTimeParams = [
    param('roomID')
        .isInt({ min: 1 })
        .withMessage('Room ID must be a positive integer')
        .notEmpty()
        .withMessage('Room ID is required'),

    param('startTime')
        .isISO8601()
        .withMessage('Start time must be a valid date')
        .notEmpty()
        .withMessage('Start time is required'),

    param('endTime')
        .isISO8601()
        .withMessage('End time must be a valid date')
        .notEmpty()
        .withMessage('End time is required'),

    param('day')
        .isISO8601()
        .withMessage('Day must be a valid date')
        .notEmpty()
        .withMessage('Day is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate schedule update
const validateScheduleUpdate = [
    param('scheduleID')
        .isInt({ min: 1 })
        .withMessage('Schedule ID must be a positive integer')
        .notEmpty()
        .withMessage('Schedule ID is required'),

    body('roomID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Room ID must be a positive integer'),

    body('startTime')
        .optional()
        .isISO8601()
        .withMessage('Start time must be a valid date'),

    body('endTime')
        .optional()
        .isISO8601()
        .withMessage('End time must be a valid date'),

    body('day')
        .optional()
        .isISO8601()
        .withMessage('Day must be a valid date'),

    body('scheduleType')
        .optional()
        .isIn(['LECTURE', 'LAB', 'SEMINAR', 'TUTORIAL', 'EXAM', 'OFFICE_HOURS', 'STUDY_SESSION', 'FACULTY_MEETING', 'CONFERENCE', 'WORKSHOP', 'GUEST_LECTURE', 'SPORTS_EVENT', 'LIBRARY_BOOKING'])
        .withMessage('Schedule type must be one of: LECTURE, LAB, SEMINAR, TUTORIAL, EXAM, OFFICE_HOURS, STUDY_SESSION, FACULTY_MEETING, CONFERENCE, WORKSHOP, GUEST_LECTURE, SPORTS_EVENT, LIBRARY_BOOKING'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateSchedule,
    validateScheduleIDParam,
    validateRoomAndTimeParams,
    validateScheduleUpdate
};