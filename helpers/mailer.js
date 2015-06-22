module.exports = function (app) {
    var _ = require('../public/js/libs/underscore/underscore.js');
    var nodemailer = require("nodemailer");
    var smtpTransport = require('nodemailer-smtp-transport');
    var fs = require('fs');

    this.forgotPassword = function (options){
        var templateOptions = {
            email: options.email,
            password: options.password
        };
        var mailOptions = {
            from: 'Test',
            to: options.email,
            subject: 'New password',
            generateTextFromHTML: true,
            html: _.template(fs.readFileSync('public/templates/mailer/forgotPassword.html', encoding = "utf8"), templateOptions)
        };

        deliver(mailOptions);
    };

    this.confirmEmail = function (options){
        var templateOptions = {
            email: options.email,
            url: process.env.APP_HOST + ':' + process.env.PORT + '/users/confirm?token=' + options.confirm_token
        };
        var mailOptions = {
            from: 'Test',
            to: options.email,
            subject: 'Confirm email',
            generateTextFromHTML: true,
            html: _.template(fs.readFileSync('public/templates/mailer/confirmEmail.html', encoding = "utf8"), templateOptions)
        };

        deliver(mailOptions);
    };

    function deliver(mailOptions, cb) {
        var transport = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: "gogi.gogishvili",
                pass: "gogi123456789"
            }
        }));

        transport.sendMail(mailOptions, function (err, response) {
            if (err) {
                console.log(err);
                if (cb && (typeof cb === 'function')) {
                    cb(err, null);
                }
            } else {
                console.log("Message sent: " + response.message);
                if (cb && (typeof cb === 'function')) {
                    cb(null, response);
                }
            }
        });
    }

};

