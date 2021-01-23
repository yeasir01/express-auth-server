"use strict";

const JWT = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { tokens } = require('../config/setup');

module.exports = (req, res, next) => {
    let pkc = fs.readFileSync(path.resolve(__dirname, "../public/rsa/access_public.pem"), 'utf8');
    let token = req.cookies.access_token;

    let opt = {
        audience: tokens.audience,
        issuer: tokens.issuer,
        algorithms: ["RS256"]
    };

    if (token) {
        JWT.verify(token, pkc, opt, (err, decoded) => {
            if (err) {
                console.log(err)

                return res.status(403).json({
                    success: false,
                    errors: [{
                        status: 403,
                        msg: "Access is denied."
                    }]
                });
            }

            if (decoded) {
                req.user = decoded;
                return next();
            }

            return res.status(422).json({
                success: false,
                errors: [{
                    status: 422,
                    msg: "Unable to process your request at this time."
                }]
            });

        })
    } else {
        return res.status(403).json({
            success: false,
            errors: [{
                status: 403,
                msg: "Access is denied."
            }]
        });
    }
};