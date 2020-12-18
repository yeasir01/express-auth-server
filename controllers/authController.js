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
                    }
                    
                    return res.status(401).json({success: false, msg: "Invalid credentials"});
                })
            })
            .catch( err => {

                res.status(500).json({success: false, message: "Internal server issue"})

                log({
                    level: "error",
                    source: "authController.js",
                    description: "Failed at login",
                    user: req.body.email,
                    error: err
                });
            })
    },
    register: (req, res)=>{
        User.findOne({email: req.body.email})
            .then( result => {
                if (result) {
                    return res.json({success: false, msg: "That email already exists, please use forgot password to recover"});
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

                    res.status(201).json({success: true, msg: 'User sucessfully created'})
                })
    
            })
            .catch( err => {

                res.status(422).json({success: false, message: "Unable to process your request at this time."})

                log({
                    level: "error",
                    source: "authController.js",
                    description: "Failed at registration",
                    user: req.body.email,
                    error: err
                });
            })

    }
}