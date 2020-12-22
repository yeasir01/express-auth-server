const JWT = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

module.exports = {
    verifyJWT: user => {
        
    },    
    issueJWT: user => {
        return new Promise ((resolve, reject) => {
            try {

                const jwtPrivateKey = fs.readFileSync(path.resolve(__dirname ,"../config/jwt_private.pem"), {encoding:'utf8'});
                const refreshPrivateKey = fs.readFileSync(path.resolve(__dirname ,"../config/refresh_private.pem"), {encoding:'utf8'});
                const issuedAt = Math.floor(Date.now() / 1000);
                
                const accessPayload = {
                    iat: issuedAt,
                    sub: user._id,
                    role: user.role
                };

                const refreshPayload = {
                    iat: issuedAt,
                    sub: user._id
                };

                const accessOpt = {
                    algorithm: 'RS256',
                    expiresIn: process.env.JWT_EXPIRES_IN
                };
                
                const refreshOpt = {
                    algorithm: 'RS256',
                    expiresIn: process.env.REFRESH_EXPIRES_IN
                };
        
                const access_token = JWT.sign(accessPayload, jwtPrivateKey, accessOpt);
                const refresh_token = JWT.sign(refreshPayload, refreshPrivateKey, refreshOpt);
            
                resolve({
                    access_token, 
                    refresh_token
                })

            } catch(e) {
                reject(e)
            }
        })
    },    
    verifyRefreshJWT: token => {
        return new Promise((resolve, reject) => {
            
            const opt = {
                audience: 'http://www.resource-server-url.com',
                issuer: '',
                algorithms: ['RS256']
            };

            JWT.verify(token, process.env.REFRESH_PUBLIC_KEY, opt, (err, decoded) => {
                if (err) reject(err)

                const user = {
                    id: decoded.sub
                }

                resolve(user)
            })
        })
    },
    checkBlackList: token => {

    }
};