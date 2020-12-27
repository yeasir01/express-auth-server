const JWT = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

module.exports = {    
    issueJWT: user => {
        return new Promise ((resolve, reject) => {
            try {

                const accessPrivateKey = fs.readFileSync(path.resolve(__dirname ,"../config/access_private.pem"), {encoding:'utf8'});
                const refreshPrivateKey = fs.readFileSync(path.resolve(__dirname ,"../config/refresh_private.pem"), {encoding:'utf8'});
                const issuedAt = Math.floor(Date.now() / 1000);
                
                const payload = {
                    iat: issuedAt,
                    sub: user._id
                };

                const accessOpt = {
                    algorithm: "RS256",
                    expiresIn: "15m"
                };
                
                const refreshOpt = {
                    algorithm: 'RS256',
                    expiresIn: "30d"
                };
        
                const access_token = JWT.sign(payload, accessPrivateKey, accessOpt);
                const refresh_token = JWT.sign(payload, refreshPrivateKey, refreshOpt);
            
                resolve({
                    access_token, 
                    refresh_token
                })

            } catch(e) {
                reject(e)
            }
        })
    },    
    verifyRefreshToken: token => {
        return new Promise((resolve, reject) => {

            const refreshPublicKey = fs.readFileSync(path.resolve(__dirname ,"../public/rsa/refresh_public.pem"), {encoding:'utf8'});
            
            const opt = {
/*                 audience: 'http://www.resource-server-url.com',
                issuer: '', */
                algorithms: ['RS256']
            };

            JWT.verify(token, refreshPublicKey, opt, (err, decoded) => {
                if (err) reject(err)

                const user = {
                    _id: decoded.sub
                }

                resolve(user)
            })
        })
    },
    checkBlackList: token => {

    }
};