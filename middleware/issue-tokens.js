"use strict";

const JWT = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
//black list all old token when generating new ones.
module.exports = (req, res) => {
    try {
        let apk = fs.readFileSync(path.resolve(__dirname, "../config/access_private.pem"), 'utf8');
        let rpk = fs.readFileSync(path.resolve(__dirname, "../config/refresh_private.pem"), 'utf8');
        let issuedAt = Math.floor(Date.now() / 1000);
        let refreshTTL = 30 * 24 * 60 * 60;
        let accessTTL = 15 * 60;
        let user = req.user;

        if (!user) {
            throw new Error("User does not exist on the request object. Unable to generate tokens!")
        };

        let payload = {
            iat: issuedAt,
            sub: user._id
        };

        let accessOpt = {
            algorithm: "RS256",
            expiresIn: accessTTL,
            issuer: process.env.ISSUER,
            audience: process.env.AUDIENCE
        };

        let refreshOpt = {
            algorithm: 'RS256',
            expiresIn: refreshTTL,
            issuer: process.env.ISSUER,
            audience: process.env.AUDIENCE
        };

        let accessToken = JWT.sign(payload, apk, accessOpt);
        let refreshToken = JWT.sign(payload, rpk, refreshOpt);

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: accessTTL * 1000
        })

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: refreshTTL * 1000
        })

        return res.status(200).json({
            success: true,
            status: 200
        });

    } catch (e) {
        console.log(e);

        res.status(422).json({
            success: false,
            errors: [{
                msg: "The server was unable to process your request, please try again later."
            }]
        });
    }
}