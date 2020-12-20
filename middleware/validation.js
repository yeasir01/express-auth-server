const { validationResult, body } = require('express-validator');
const log = require('./log');

module.exports = {
    validate: (req, res, next) => {
        try {

            let errors = validationResult(req);
    
            if (errors.isEmpty()) {
                next()
            } else {
                let debugData = JSON.stringify(errors.array());
                res.status(422).json({success: false, errors: errors.array()});

                log({
                    level: 'warning',
                    source: './middleware/validation.js',
                    description: 'Failed to validate/sanatize client request.',
                    debug: debugData,
                    user: req.body.email || 'anonymous',
                    geoLocation: req.body.geoLocation
                });
            }

        } catch (e) {

            res.status(422).json({success: false, msg: "Server validation failed. Error logged."});

            log({
                level: 'error',
                source: './middleware/validation.js',
                description: 'Validate funtion threw an error.',
                debug: e
            });
        }
    },
    loginSchema: () =>{
        return [
            body('email').isEmail().withMessage('Invalid email format.'),
            body('password').isLength({min: 8}).withMessage('Password must contain at least 8 characters.')
        ]
    },
    regSchema: () =>{
        return [
            body('email').isEmail().withMessage('Invalid email format'),
            body('password').isLength({min: 8}).withMessage('Password must contain at least 8 characters.'),
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