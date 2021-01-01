"use strict";

const User = require('../models/user');
const JWT = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

module.exports = {
    login: async (req, res, next) => {
        try {
            const user = await User.findOne({email: req.body.email}).select('+password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    errors: [{
                        msg: "Invalid credentials."
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
                    req.user = user;
                    req.user.password = undefined;
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
            const user = await User.findOne({email: req.body.email});

            if (user) {
                return res.status(409).json({
                    success: false,
                    status: 409,
                    errors: [{
                        msg: "That email is already in use.",
                    }]
                });
            } else {
                const new_user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
                })
                const user = await new_user.save();
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
    refresh: (req, res, next) => {
        try {
            const pkcPath = path.resolve(__dirname, "../public/rsa/refresh_public.pem");
            const pkc = fs.readFileSync(pkcPath, 'utf8');
            const refreshToken = req.cookies.refresh_token;
            
            if (!refreshToken) {
                return res.status(422).json({
                    success: false,
                    errors: [{
                        msg: "Refresh token missing or invalid"
                    }]
                });
            }

            const opt = {
                aud: process.env.AUDIENCE,
                iss: process.env.ISSUER,
                algorithms: ["RS256"]
            };
            
            JWT.verify(refreshToken, pkc, opt, (err, decoded) => {
                if (err) throw err

                if (decoded) {
                    req.user = {_id: decoded.sub}
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