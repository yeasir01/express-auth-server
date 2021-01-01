"use strict";

const { generateKeyPair } = require('crypto');
const path = require('path');
const fs = require('fs');

const opt = {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  }
}

generateKeyPair('rsa', opt, (err, publicKey, privateKey) => {
  if (err) console.log(err);

  fs.writeFileSync(path.resolve(__dirname, "../config/access_private.pem"), privateKey);
  fs.writeFileSync(path.resolve(__dirname, "../public/rsa/access_public.pem"), publicKey);
  return;
});

generateKeyPair('rsa', opt, (err, publicKey, privateKey) => {
  if (err) console.log(err);

  fs.writeFileSync(path.resolve(__dirname, "../config/refresh_private.pem"), privateKey);
  fs.writeFileSync(path.resolve(__dirname, "../public/rsa/refresh_public.pem"), publicKey);
  return;
});