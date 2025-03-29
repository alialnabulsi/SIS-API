const {body, param, validationResult} = require('express-validator');

//createLocation case
 const validateLocation = [
     body('city')
         .isString()
         .withMessage('City must be a string')
         .notEmpty()
         .withMessage('City is required')
         .isLength({ min: 3, max: 255 }) 
         .withMessage('City name must be between 3 and 255 characters'),
     body('zipCode')
         .isString()
         .withMessage('Zip Code must be a string')
         .notEmpty()
         .withMessage('Zip Code is required')
         .isLength({max:255})
         .withMessage('Zip Code must not be longer than 255 characters'),
     body('address')
         .isString()
         .withMessage('Address must be a string')
         .notEmpty()
         .withMessage('Address is required')
         .isLength({ min: 5, max: 255 })
         .withMessage('Address must be between 5 and 255 characters'),
     (req, res, next) => {
         const errors = validationResult(req);
         if(!errors.isEmpty()){
             return res.status(400).json({errors: errors.array()});
         }
         next();
     }
 ];

 //getLocation case

const validateCityParam = [
    param('city')
        .isString()
        .withMessage('City must be a string')
        .notEmpty()
        .withMessage('City is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('City name must be between 3 and 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateLocationIDParam = [
    param('locationID')
        .isInt({ min: 1 }) 
        .withMessage('Location ID must be a positive integer')
        .notEmpty()
        .withMessage('Location ID is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

//updateLocation case
 const validateLocationUpdate = [
    param('city')
        .isString()
        .withMessage('City must be a string')
        .notEmpty()
        .withMessage('City is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('City name must be between 3 and 255 characters'),

    body('zipCode')
        .optional()
        .isString()
        .withMessage('Zip Code must be a string')
        .isLength({ max: 255 })
        .withMessage('Zip Code must not be longer than 255 characters'),

    body('address')
        .optional()
        .isString()
        .withMessage('Address must be a string')
        .isLength({ min: 5, max: 255 })
        .withMessage('Address must be between 5 and 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
 

 module.exports = {validateLocation,validateCityParam,validateLocationUpdate,validateLocationIDParam};
 