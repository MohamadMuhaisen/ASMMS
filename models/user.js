var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    fName: String,
    lName: String,
    balance: Number,
    created: { type: Date, default: Date.now },
    p: String,
    confirmed: Boolean,
    confirmationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: { type: Boolean, default: false },
    password: String,
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);;