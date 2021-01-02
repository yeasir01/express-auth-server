"use strict";

const User = require('../models/user');
const JWT = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

module.exports = {
    login: async (req, res, next) => {
        try {
            let user = await User.findOne({email: req.body.email}).select('+password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    errors: [{
                        msg: "Invalid credentials."
                    }]
                });
            }

            if (!user.emailVerifed) {
                return res.status(400).json({
                    success: false,
                    errors: [{
                        msg: "Your email must be verified before you can sign in."
                    }]
                });
            }

            if (!user.isActive) {
                return res.status(400).json({
                    success: false,
                    errors: [{
                        msg: "This account has been marked inactive, please contact support."
                    }]
                });
            }

            user.comparePassword(req.body.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    user.password = undefined;
                    req.user = user;
                    return next();
                }

                return res.status(401).json({
                    success: false,
                    status: 401,
                    errors: [{
                        msg: "Invalid credentials."
                    }]
                });

            });
        } catch (e) {
            console.log(e);

            return res.status(422).json({
                success: false,
                errors: [{
                    msg: "Unable to process your request at this time."
                }]
            });
        }
    },
    register: async (req, res, next) => {
        try {
            let user = await User.findOne({email: req.body.email});

            if (user) {
                return res.status(409).json({
                    success: false,
                    status: 409,
                    errors: [{
                        msg: "That email is already in use.",
                    }]
                });
            } else {
                let new_user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
                })

                let user = await new_user.save();
                
                req.user = user;
                return next();
            }
        } catch (e) {
            console.log(e);

            return res.status(422).json({
                success: false,
                errors: [{
                    msg: "Unable to process your request at this time."
                }]
            });
        }
    },
    verifyRefresh: (req, res, next) => {
        try {
            let pkcPath = path.resolve(__dirname, "../public/rsa/refresh_public.pem");
            let pkc = fs.readFileSync(pkcPath, 'utf8');
            let refreshToken = req.cookies.refresh_token;
            
            if (!refreshToken) {
                return res.status(422).json({
                    success: false,
                    errors: [{
                        msg: "Refresh token missing or invalid"
                    }]
                });
            }

            let opt = {
                aud: process.env.AUDIENCE,
                iss: process.env.ISSUER,
                algorithms: ["RS256"]
            };
            
            JWT.verify(refreshToken, pkc, opt, async (err, decoded) => {
                if (err) throw err

                if (decoded) {
                    let user = await User.findOne({_id: decoded.sub});

                    if (!user) throw new Error('There was no user object present on the JWT.verify method.')

                    req.user = user;
                    return next()
                }

                return res.status(422).json({
                    success: false,
                    errors: [{
                        msg: "Invalid or expired token."
                    }]
                });
            })
        } catch (e) {
            console.log(e);

            return res.status(422).json({
                success: false,
                errors: [{
                    msg: "Unable to process your request at this time."
                }]
            });
        }
    },
    test: (req, res) => {
        res.status(200).json({
            msg: "That worked, heres your user data.",
            user: req.user
        });
    }
};