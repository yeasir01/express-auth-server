"use strict";

const nodemailer = require('nodemailer');
const hbs = require('handlebars');
const path = require('path');
const fs = require('fs');

module.exports = async (options) => {
    try {
        if (typeof options != "object") throw new Error("The sendMail function requires an object in the callback.")

        let template = fs.readFileSync(path.resolve(__dirname, "..", "templates", options.template + ".hbs"), 'utf8');
        let compiledTemp = hbs.compile(template);
        let HTMLBody = compiledTemp(options);

        let transporter = nodemailer.createTransport({
            host: "smtp.sendgrid.net",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_SERVICE_USERNAME,
                pass: process.env.EMAIL_SERVICE_API,
            },
        });

        return await transporter.sendMail({
            from: `${process.env.EMAIL_FROM_DISPLAY} <${process.env.EMAIL_ADDRESS}>`,
            to: options.email,
            subject: options.subject,
            text: options.text,
            html: HTMLBody,
        });

    } catch (e) {
        console.log(e)
    }

}

/* 
//send mail w/property options
sendMail({
    email: "yeasir01@gmail.com",
    firstName: "Yeasir",
    lastName: "Hugais",
    subject: "Please verify your email.",
    text: "This is an optional text",
    template: "verify-email"
}); 
*/