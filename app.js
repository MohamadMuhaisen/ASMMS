require('dotenv').config()
const express = require('express'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require("connect-flash"),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    User = require("./models/user"),
    app = express();

app.use(compression());
const mainRoutes = require("./routes/mainRoutes"),
    auth = require("./routes/auth");

//Configurations
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DBCREDINTIALS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.set("view engine", "ejs");
app.use(require('express-session')({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
// static folder
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
//Auth config

app.use(passport.initialize());
app.use(passport.session());
// working
// passport.use(new localStrategy(User.authenticate()));
passport.use(new localStrategy(
    function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Email does not exist" });
            }
            if (user.p != password) {
                return done(null, false, { message: "Wrong password" });
            }
            if (!user.confirmed) {
                return done(null, false, { message: "Confirm your email first" });
            }
            return done(null, user);
        });
    }
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.confirmEmail = req.flash("confirmEmail");
    next();
});

app.use(mainRoutes);
app.use(auth);

app.listen(3000, function () {
    console.log("Serving on port 3000");
});