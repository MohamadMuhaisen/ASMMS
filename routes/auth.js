const { models } = require("mongoose");
var express = require("express"),
    router = express.Router(),
    passport = require('passport'),
    nodemailer = require("nodemailer"),
    randomstring = require("randomstring"),
    crypto = require("crypto"),
    async = require("async"),
    reCAPTCHA = require('recaptcha2'),
    middleware = require("../middlewares"),
    order = require("../models/orders"),
    User = require('../models/user');

const { body, validationResult } = require('express-validator');

let noReplyTransporter = nodemailer.createTransport({
    host: "nl1-ss17.a2hosting.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "noreply@asmms.com", // generated ethereal user
        pass: "noreply123", // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    },
    requireTLS:true,
    pool: true
});
let transporter = nodemailer.createTransport({
    host: "nl1-ss17.a2hosting.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "contact@asmms.com", // generated ethereal user
        pass: "Ytgua+P77]+}", // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    },
    pool: true
});
var recaptcha = new reCAPTCHA({
    siteKey: '6Le-GcEZAAAAAJrPcEJcZiqzoKg74dO1t2mYQo9x', // retrieved during setup
    secretKey: '6Le-GcEZAAAAAO7TNeVfU2nrLj_JA5ZyIapKmIOF' // retrieved during setup
});

router.post("/register", [
    body('username').isEmail(),
    body('password').isLength({ min: 8, max: 20 })
], function (req, res) {
    recaptcha.validateRequest(req)
        .then(function () {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.flash("error", "Wrong information!");
                return res.redirect("/dashboard");
            }
            var token = randomstring.generate();
            User.register(new User({
                username: req.body.username,
                fName: req.body.fName,
                lName: req.body.lName,
                balance: '0',
                p: req.body.password,
                confirmed: false,
                confirmationToken: token,
            }), req.body.password, function (err, user) {
                if (err) {
                    req.flash("error", "Email already exists.");
                    return res.redirect("/");
                }
                //--------Confirmation EMAIL
                var url = "https://asmms.com/confirmation/";
                transporter.sendMail({
                    from: '"ASMMS NoReply" <noreply@asmms.com>', // sender address
                    to: `"${req.body.username}"`,
                    subject: "Email Confirmation",
                    html: `<p>Please confirm your email address by clicking on the following link</P>
                This Link: ${url + token}
                `,
                });
                req.flash("confirmEmail", "A confirmation Email has been sent to your Email. Kindly check your spam folder as well");
                res.redirect("/");
            });
        })
        .catch(function () {
            req.flash("error", "Please solve the captcha!");
            return res.redirect("/");
        });
});

router.get("/confirmation/:token", async (req, res) => {
    try {
        const user = await User.findOne({ confirmationToken: req.params.token });
        if (!user) {
            req.flash("error", "User not found!");
            res.redirect("/");
            return;
        }
        user.confirmed = true;
        user.confirmationToken = "";
        user.save();
        req.flash("success", "Your Email has been successfully confirmed. You may login now!");
        return res.redirect("/");
    } catch (error) {
        req.flash("error", "Bad request");
        res.redirect("/");
    }
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash: true
}));

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

router.get('/reset/:token', async (req, res) => {
    await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/');
        }
        res.render('reset', { token: req.params.token });
    });
});

router.post('/reset/:token', async (req, res) => {
    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('/');
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function (err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                        user.p = req.body.password;
                        user.save(function (err) {
                            done(err, user);
                        });
                    });
                } else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        function (user, done) {
            var mailOptions = {
                to: user.username,
                from: '"NoReply" <noreply@asmms.com>',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
            };
            noReplyTransporter.sendMail(mailOptions, function (err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/');
    });
});

router.post('/forgot', function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ username: req.body.username }, function (err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            let mailOptions = {
                to: user.username,
                from: '"NoReply" <noreply@asmms.com>',
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            noReplyTransporter.sendMail(mailOptions, function (err) {
                req.flash('success', 'An e-mail has been sent to ' + user.username + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/');
    });
});

router.get("/admin", middleware.isLoggedIn, function (req, res) {
    if (req.user.isAdmin) {
        order.find(function (err, allOrders) {
            if (err) {
                console.log(err);
            } else {
                res.render("admin", { orders: JSON.stringify(allOrders) });
            }
        });
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;