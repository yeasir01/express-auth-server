"use strict";

const nodemailer = require('nodemailer');
const hbs = require('handlebars');
const path = require('path');
const fs = require('fs');
const { email } = require('../config/setup');

module.exports = async (options) => {
    try {
        if (typeof options != "object") throw new Error("The sendMail function requires an object in the callback.")

        let template = fs.readFileSync(path.resolve(__dirname, "..", "templates", options.template), 'utf8');
        let compiledTemp = hbs.compile(template);
        let HTMLBody = compiledTemp(options.data);

        let transporter = nodemailer.createTransport({
            host: email.host,
            port: email.port,
            secure: email.secure,
            auth: {
                user: process.env.EMAIL_SERVICE_USERNAME,
                pass: process.env.EMAIL_SERVICE_API,
            },
        });

        await transporter.sendMail({
            from: `${options.from || email.defaultFrom} <${email.eAddress}>`,
            to: options.email,
            subject: options.subject,
            text: options.text,
            html: HTMLBody,
        });

        return;

    } catch (e) {
        console.log(e)
    }

}