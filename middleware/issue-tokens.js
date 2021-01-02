"use strict";

const JWT = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
//black list all old token when generating new ones.
module.exports = (req, res) => {
    try {
        let apkPath = path.resolve(__dirname, "../config/access_private.pem");
        let rpkPath = path.resolve(__dirname, "../config/refresh_private.pem");
        let apk = fs.readFileSync(apkPath, 'utf8');
        let rpk = fs.readFileSync(rpkPath, 'utf8');
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
            expiresIn: "15m",
            issuer: process.env.ISSUER,
            audience: process.env.AUDIENCE
        };

        let refreshOpt = {
            algorithm: 'RS256',
            expiresIn: "30d",
            issuer: process.env.ISSUER,
            audience: process.env.AUDIENCE
        };

        let accessToken = JWT.sign(payload, apk, accessOpt);
        let refreshToken = JWT.sign(payload, rpk, refreshOpt);

        return res.status(200)
            .cookie('access_token', accessToken)
            .cookie('refresh_token', refreshToken)
            .json({
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