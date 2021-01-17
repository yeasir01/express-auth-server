"use strict";

const { validationResult, body } = require('express-validator');

module.exports = {
    validate: (req, res, next) => {
        try {

            let errors = validationResult(req);
    
            if (errors.isEmpty()) {
                return next()
            } else {
                return res.status(422).json({
                    success: false,
                    errors: errors.array()
                });
            }

        } catch (e) {

            return res.status(422).json({
                success: false,
                errors: [{
                    status: 422,
                    msg: "Unable to validate client request, please try again later."
                }]
            });
        }
    },
    logSchema: () => {
        return [
            body('email').isEmail().withMessage('Invalid email format.'),
            body('password').isLength({min: 8}).withMessage('Password must contain at least 8 characters.')
        ]
    },
    regSchema: () => {
        return [
            body('email').isEmail().withMessage('Invalid email format'),
            body('password').isLength({min: 8}).withMessage('Password must contain at least 8 characters.'),
            body('firstName').trim().isLength({min: 3}).escape(),
            body('lastName').trim().isLength({min: 3}).escape(),
        ]
    }
}