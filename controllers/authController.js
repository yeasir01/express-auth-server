const User = require('../models/User');
const log = require('../middleware/log');
const { issueJWT } = require('../utils/jwtHelper');

module.exports = {
    login: (req, res) => {
        User.findOne({email: req.body.email}).select('+password')
            .then( user => {
                
                if (!user) {
                    res.status(401).json({
                        success: false,
                        errors: [{
                            code: 401,
                            msg: "Invalid credentials."
                        }]
                    });

                    return;
                }

                if (!user.isActive) {
                    res.status(400).json({
                        success: false,
                        errors: [{
                            code: 400,
                            msg: "This account has been marked inactive, please contact support."
                        }]
                    });

                    return;
                }

                user.comparePassword(req.body.password, (err, isMatch) => {
                    
                    if (err) throw err;

                    if (isMatch) {
                        
                        issueJWT(user)
                            .then(tokens => {

                                res.status(200).json({
                                    success: true,
                                    access_token: tokens.access_token,
                                    refresh_token: tokens.refresh_token
                                });

                                log({
                                    level: "info",
                                    source: "./controller/authController.js",
                                    description: "Sucessful login",
                                    user: user.email,
                                    geoLocation: req.body.geoLocation
                                });

                            })
                            .catch(e => {
                                res.status(422).json({
                                    success: false,
                                    errors: [{
                                        code: 422,
                                        msg: "Unable to process your request at this time."
                                    }]
                                });

                                log({
                                    level: "error",
                                    source: "./controller/authController.js",
                                    description: "An error was thrown while attepting to issue tokens at login",
                                    user: user.email,
                                    geoLocation: req.body.geoLocation,
                                    debug: e
                                });

                                return;
                            })

                        return;
                    };
                        
                    res.status(401).json({
                        success: false,
                        errors: [{
                            code: 401,
                            msg: "Invalid credentials."
                        }]
                    });

                    log({
                        level: "warning",
                        source: "./controller/authController.js",
                        description: "Unsuccessful login attempt.",
                        user: user.email,
                        geoLocation: req.body.geoLocation
                    });

                    return;
                })
            })
            .catch(e => {

                res.status(422).json({
                    success: false,
                    errors: [{
                        code: 422,
                        msg: "Unable to process your request at this time."
                    }]
                });

                log({
                    level: "error",
                    source: "./controller/authController.js",
                    description: "Login function threw an error.",
                    user: req.body.email,
                    geoLocation: req.body.geoLocation,
                    debug: e
                });

                return;
            })
    },
    register: (req, res) => {
        User.findOne({email: req.body.email})
            .then( result => {
                
                if (result) {
                    
                    res.status(409).json({
                        success: false,
                        errors: [{
                            code: 409,
                            msg: "That email already exists! Please use password recovery option."
                        }]
                    });

                    return;
                }

                let new_user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                    geoLocation: JSON.stringify(req.body.geoLocation)
                })

                new_user.save( (err, user) => {
                    if (err) throw err;

                    res.status(201).json({success: true, msg: 'User sucessfully created'});
                    
                    log({
                        level: "info",
                        source: "./controllers/authController.js",
                        description: "New user created.",
                        user: user.email,
                        geoLocation: user.geoLocation
                    });

                    return;
                })
    
            })
            .catch(e => {

                res.status(422).json({
                    success: false,
                    errors: [{
                        code: 422,
                        msg: "Unable to process your request at this time."
                    }]
                });

                log({
                    level: "error",
                    source: "./controllers/authController.js",
                    description: "Register function threw an error.",
                    user: req.body.email,
                    debug: e
                });
            })

    },
    refresh: (req, res) => {

    }
}