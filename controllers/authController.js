const User = require('../models/User');
const log = require('../middleware/log');

module.exports = {
    login: (req, res) => {
        User.findOne({email: req.body.email}).select('+password')
            .then( user => {
                
                if (!user) {
                    return res.status(401).json({success: false, msg: "Invalid credentials"});
                }

                if (!user.isActive) {
                    return res.status(400).json({success: false, msg: "This account has been marked inactive"});
                }

                user.comparePassword(req.body.password, (err, isMatch) => {
                    
                    if (err) throw err;

                    if (isMatch) {
                        res.status(200).json({success: true, msg: "Awsome thats a match!"});

                        return log({
                            level: "info",
                            source: "./controller/authController.js",
                            description: "Sucessful login",
                            user: user.email,
                            geoLocation: req.body.geoLocation
                        });

                    }
                        res.status(401).json({success: false, msg: "Invalid credentials"});

                        return log({
                            level: "warning",
                            source: "./controller/authController.js",
                            description: "Unsuccessful login attempt.",
                            user: user.email,
                            geoLocation: req.body.geoLocation
                        });

                })
            })
            .catch( e => {

                res.status(500).json({success: false, msg: "Internal server issue"})

                log({
                    level: "error",
                    source: "./controller/authController.js",
                    description: "Login attempt threw an error.",
                    user: req.body.email,
                    geoLocation: req.body.geoLocation,
                    debug: e
                });
            })
    },
    register: (req, res) => {
        User.findOne({email: req.body.email})
            .then( result => {
                
                if (result) {
                    return res.json({success: false, msg: "That account already exists, please use forgot password to recover."});
                }

                let newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                    geoLocation: req.body.geoLocation
                })

                newUser.save(function (err, user) {
                    if (err) throw err;

                    res.status(201).json({success: true, msg: 'User sucessfully created'});
                    
                    return log({
                        level: "info",
                        source: "./controllers/authController.js",
                        description: "New user created.",
                        user: user.email,
                        geoLocation: user.geoLocation
                    });
                })
    
            })
            .catch( e => {

                res.status(422).json({success: false, msg: "Unable to process your request at this time."})

                log({
                    level: "error",
                    source: "./controllers/authController.js",
                    description: "Registration attempt threw an error.",
                    user: req.body.email,
                    debug: e
                });
            })

    }
}