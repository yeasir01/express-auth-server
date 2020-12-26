const JWT = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const log = require('./log');

module.exports = (req, res, next) => {
    const accessPublicKey = fs.readFileSync(path.resolve(__dirname, "../public/rsa/access_public.pem"), {
        encoding: 'utf8'
    });
    const authHeader = req.headers['authorization'];
    const tokenBody = req.body.token;

    const opt = {
        /*  audience: 'http://www.resource-server-url.com',
         issuer: '', */
        algorithms: ['RS256']
    };

    if (authHeader) {
        const tokenArray = authHeader.split(' ');
        const tokenHeader = tokenArray[1];

        JWT.verify(tokenHeader, accessPublicKey, opt, (err, decoded) => {

            if (err) {
                res.status(403).json({
                    success: false,
                    errors: [{
                        status: 403,
                        msg: "Invalid token."
                    }]
                });

                log({
                    level: "warning",
                    source: "./middleware/authorize.js",
                    description: "Invalid access token in header.",
                    user: req.body.email,
                    geoLocation: req.body.geoLocation,
                    debug: err
                });

                return;

            } else {
                req.user = decoded;
                return next()
            }
        })

    } else {

        JWT.verify(tokenBody, accessPublicKey, opt, (err, decoded) => {

            if (err) {
                res.status(403).json({
                    success: false,
                    errors: [{
                        status: 403,
                        msg: "Invalid token."
                    }]
                });

                log({
                    level: "warning",
                    source: "./middleware/authorize.js",
                    description: "Invalid access token in body.",
                    user: req.body.email,
                    geoLocation: req.body.geoLocation,
                    debug: err
                });

                return;

            } else {
                req.user = decoded;
                return next()
            }
        })
    }
};

//TODO
// SET COOKIES FIRST
//check browser type
//if web browser, then check cookies for Bearer access token
//else check body for access token