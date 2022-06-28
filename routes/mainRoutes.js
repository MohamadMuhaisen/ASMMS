var express = require("express"),
    router = express.Router(),
    nodemailer = require("nodemailer"),
    category = require("../models/categories"),
    middleware = require("../middlewares"),
    randomstring = require("randomstring"),
    reCAPTCHA = require('recaptcha2'),
    order = require("../models/orders");

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
    pool: true
});
var recaptcha = new reCAPTCHA({
    siteKey: '6Le-GcEZAAAAAJrPcEJcZiqzoKg74dO1t2mYQo9x', // retrieved during setup
    secretKey: '6Le-GcEZAAAAAO7TNeVfU2nrLj_JA5ZyIapKmIOF' // retrieved during setup
});

router.get("/", (req, res) => {
    res.render("index");
})

router.get("/home", function (req, res) {
    res.redirect("/");
})

router.get("/dashboard", middleware.isLoggedIn, function (req, res) {
    category.find(function (err, categories) {
        if (err) {
            console.log(err);
        } else {
            res.render("dashboard", { catg: JSON.stringify(categories) });
        }
    });
});

//contact us form
router.post("/contact", function (req, res) {
    recaptcha.validateRequest(req)
        .then(function () {
            const mail = `
            <p>You have a new contact request</p>
            <h3>Details</h3>
            <ul>
                <li>Name: ${req.body.name}</li>
                <li>Email: ${req.body.email}</li>
            </ul>
            <h3>Message:</h3>
            <p>${req.body.message}</p>`;
            // send mail with defined transport object
            noReplyTransporter.sendMail({
                from: '"Mailer" <contact@asmms.com>', // sender address
                to: "info@asmms.com, mheisenberg00@gmail.com, ali_rakka2001@hotmail.com", // list of receivers
                subject: "Contact Request", // Subject line
                text: "Hello world?", // plain text body
                html: mail, // html body
            });
            req.flash("success", "Your message has been received, We will get back with you shortly.");
            return res.redirect("/");
        })
        .catch(function () {
            req.flash("error", "Please solve the captcha!");
            return res.redirect("/");
        });
});

router.post("/order", middleware.isLoggedIn, [
    body('category').exists(),
    body('service').exists(),
    body('quantity').isInt().isLength({ min: 4 }),
    body('link').isURL(),
], async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("error", "Wrong information!");
        return res.redirect("/dashboard");
    }
    var catg = await category.findOne({ id: req.body.category });
    var user = req.user;

    if (user.balance < req.body.quantity * (catg.services[req.body.service].rate / 1000)) {
        req.flash("error", "Insufficient funds.");
        return res.redirect("/dashboard");
    } else {
        user.balance -= req.body.quantity * (catg.services[req.body.service].rate / 1000);
        user.save();
    }
    var confirmationToken = randomstring.generate()
    category.findOne({ id: req.body.category }, function (err, cat) {
        if (err) {
            req.flash("error", "Try again later.");
            return res.redirect("/dashboard");
        } else {
            var newOrder = new order({
                user: req.user.username,
                category: cat.name,
                service: cat.services[req.body.service],
                quantity: req.body.quantity,
                link: req.body.link,
                cost: req.body.quantity * (cat.services[req.body.service].rate / 1000),
                status: "Awaiting confirmation",
                token: confirmationToken,
            });
            const url = "https://asmms.com/confirm/order/";
            const mail = `
            <h2>Confirm your order</h2>
            <h3>Details</h3>
            <ul>
                <li>Category: ${catg.name}</li>
                <li>Service: ${newOrder.service.quality} ${newOrder.service.name}</li>
                <li>Quantity: ${newOrder.quantity}</li>
                <li>Link: ${newOrder.link}</li>
                <li>Cost: $${newOrder.cost}</li>
            </ul>
            <h3>Kindly confirm your order by clicking the following Link : </h3>
            <p>${url + confirmationToken}</p>
            <p>Best regards,</p>`;

            noReplyTransporter.sendMail({
                from: '<noreply@asmms.com>', // sender address
                to: `"${user.username}"`, // list of receivers
                subject: "Order Confirmation", // Subject line
                html: mail, // html body
            });
            newOrder.save(function (err) {
                if (err) {
                    req.flash("error", "Missing information");
                    return res.redirect("/dashboard");
                } else {
                    req.flash("success", "Order placed successfully, kindly check your email to confirm your order.");
                    return res.redirect("/orders");
                }
            })
        }
    });
});

router.get("/confirm/order/:token", async function (req, res) {
    try {
        let thisOrder = await order.findOne({ token: req.params.token });
        if (!thisOrder) {
            req.flash("error", "Order not found!");
            res.redirect("/dashboard");
            return;
        }
        thisOrder.status = "Pending";
        thisOrder.confirmationToken = "";
        await thisOrder.save();
        req.flash("success", "Your order has been successfully confirmed.");
        return res.redirect("/orders");
    } catch (error) {
        console.log(error);
        req.flash("error", "Bad request");
        res.redirect("/dashboard");
    }
});

router.get("/orders", middleware.isLoggedIn, function (req, res) {
    order.find({ user: req.user.username }, function (err, allOrders) {
        if (err) {
            console.log(err);
        } else {
            res.render("orders", { orders: JSON.stringify(allOrders) });
        }
    });
});

router.post("/admin/order", function (req, res) {

});

module.exports = router;