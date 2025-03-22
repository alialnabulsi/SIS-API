const { body, param, validationResult } = require('express-validator');

// Validate room creation
const validateRoom = [
    body('roomNumber')
        .isString()
        .withMessage('Room number must be a string')
        .notEmpty()
        .withMessage('Room number is required')
        .isLength({ min: 1, max: 16 })
        .withMessage('Room number must be between 1 and 16 characters'),

    body('buildingID')
        .isInt({ min: 1 })
        .withMessage('Building ID must be a positive integer')
        .notEmpty()
        .withMessage('Building ID is required'),

    body('type')
        .isString()
        .withMessage('Room type must be a string')
        .notEmpty()
        .withMessage('Room type is required')
        .isIn(['lecture', 'lab', 'seminar', 'office', 'exam hall', 'study room', 'auditorium', 'sports hall'])
        .withMessage('Invalid room type'),

    body('capacity')
        .isInt({ min: 1 })
        .withMessage('Capacity must be a positive integer')
        .notEmpty()
        .withMessage('Capacity is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate room ID parameter in routes (for specific room lookup)
const validateRoomIDParam = [
    param('roomID')
        .isInt({ min: 1 })
        .withMessage('Room ID must be a positive integer')
        .notEmpty()
        .withMessage('Room ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate room number parameter in routes (for specific room lookup by room number)
const validateRoomNumberParam = [
    param('roomNumber')
        .isString()
        .withMessage('Room number must be a string')
        .notEmpty()
        .withMessage('Room number is required')
        .isLength({ min: 1, max: 16 })
        .withMessage('Room number must be between 1 and 16 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate room update
const validateRoomUpdate = [
    param('roomID')
        .isInt({ min: 1 })
        .withMessage('Room ID must be a positive integer')
        .notEmpty()
        .withMessage('Room ID is required'),

    body('roomNumber')
        .optional()
        .isString()
        .withMessage('Room number must be a string')
        .isLength({ min: 1, max: 16 })
        .withMessage('Room number must be between 1 and 16 characters'),

    body('buildingID')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Building ID must be a positive integer'),

    body('type')
        .optional()
        .isString()
        .withMessage('Room type must be a string')
        .isIn(['lecture', 'lab', 'seminar', 'office', 'exam hall', 'study room', 'auditorium', 'sports hall'])
        .withMessage('Invalid room type'),

    body('capacity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Capacity must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateRoom,
    validateRoomIDParam,
    validateRoomNumberParam,
    validateRoomUpdate
};