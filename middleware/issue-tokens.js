"use strict";

const JWT = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const {tokens} = require('../config/setup');
//black list all old token when generating new ones.
module.exports = (req, res) => {
    try {
        let apk = fs.readFileSync(path.resolve(__dirname, "../config/access_private.pem"), 'utf8');
        let rpk = fs.readFileSync(path.resolve(__dirname, "../config/refresh_private.pem"), 'utf8');
        let issuedAt = Math.floor(Date.now() / 1000);
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
            expiresIn: tokens.accessTTL,
            issuer: tokens.issuer,
            audience: tokens.audience
        };

        let refreshOpt = {
            algorithm: 'RS256',
            expiresIn: tokens.refreshTTL,
            issuer: tokens.issuer,
            audience: tokens.audience
        };

        let accessToken = JWT.sign(payload, apk, accessOpt);
        let refreshToken = JWT.sign(payload, rpk, refreshOpt);

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: tokens.accessTTL * 1000
        })

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: tokens.refreshTTL * 1000
        })

        return res.status(200).json({
            success: true,
            status: 200
        });

    } catch (e) {
        console.log(e);

        return res.status(422).json({
            success: false,
            errors: [{
                msg: "The server was unable to process your request, please try again later."
            }]
        });
    }
}