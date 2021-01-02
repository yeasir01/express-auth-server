"use strict";

const JWT = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

module.exports = (req, res, next) => {
    let keyPath = path.resolve(__dirname, "../public/rsa/access_public.pem");
    let publicKey = fs.readFileSync(keyPath, 'utf8');
    let accessCookie = req.cookies.access_token;
    let tokenBody = req.body.token;

    let opt = {
        audience: process.env.AUDIENCE,
        issuer: process.env.ISSUER,
        algorithms: ["RS256"]
    };
 
    if (accessCookie) {
        JWT.verify(accessCookie, publicKey, opt, (err, decoded) => {
            if (err) {
                console.log(err)

                res.status(403).json({
                    success: false,
                    errors: [{
                        status: 403,
                        msg: "Invalid or expired token."
                    }]
                });
            } else {
                req.user = decoded;
                next()
            }
        })
    } else if (!accessCookie && tokenBody) {
        JWT.verify(tokenBody, publicKey, opt, (err, decoded) => {
            if (err) {
                console.log(err)

                res.status(403).json({
                    success: false,
                    errors: [{
                        status: 403,
                        msg: "Invalid or expired token."
                    }]
                });
            } else {
                req.user = decoded;
                next()
            }
        })
    } else {
        res.status(422).json({
            success: false,
            errors: [{
                status: 422,
                msg: "Invalid or missing access token."
            }]
        });
    }
};