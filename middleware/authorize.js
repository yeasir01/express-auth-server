"use strict";

const JWT = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

//black list all old token when generating new ones.

module.exports = (req, res, next) => {
    const keyPath = path.resolve(__dirname, "../public/rsa/access_public.pem");
    const publicKey = fs.readFileSync(keyPath, 'utf8');
    const accessCookie = req.cookies.access_token;
    const tokenBody = req.body.token;

    const opt = {
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