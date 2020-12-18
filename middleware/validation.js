const { validationResult, body } = require('express-validator');
const log = require('./log');

module.exports = {
    validate: (req, res, next) => {
        try {

            let errors = validationResult(req);
    
            if (errors.isEmpty()) {
                next()
            } else {
                res.status(422).json({success: false, errors: errors.array()});
            }

        } catch (err) {

            res.status(422).json({success: false, msg: "Server validation failed, this error has been logged."})

            log({
                level: 'error',
                source: 'validation.js',
                description: 'failed to validate',
                error: err
            })
        }
    },
    loginSchema: () =>{
        return [
            body('email').isEmail().withMessage('Invalid email format.'),
            body('password').isLength({min: 8}).withMessage('Password must be 8 characters or longer.')
        ]
    },
    regSchema: () =>{
        return [
            body('email').isEmail().withMessage('Invalid email format'),
            body('password').isLength({min: 8}).withMessage('Password must be 8 characters or longer.'),
            body('firstName').trim().isLength({min: 3}).escape(),
            body('lastName').trim().isLength({min: 3}).escape(),
        ]
    },
    tokenSchema: () => {
        return [
            body('token').isJWT().withMessage('Invalid token format.')
        ]
    },
}