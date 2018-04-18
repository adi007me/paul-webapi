// /auth/index.js

(function (auth) {
    var data = require("../data");
    var hasher = require("./hasher");
    var passport = require("passport");
    var localStrategy = require("passport-local").Strategy;
    var session = require('express-session');
    const MongoStore = require('connect-mongo')(session);

    function userVerify(username, password, next) {
        data.getUser(username, function (err, user) {
            if (!err && user) {
                var testHash = hasher.computeHash(password, user.salt);

                if (testHash == user.passwordHash) {
                    next(null, user);
                    return;
                }
            }

            next(null, false, { message: "Invalid Credentials." });
        });
    }

    auth.ensureAuthenticated = function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.status(401).send('Unauthorized');
        }
    }

    auth.changePassword = function (userId, curentPassword, newPassword, next) {
        var currentPasswordHash = null;
        var newPasswordHash = null;

        data.getUser(userId, function (err, user) {
            if (err) {
                next(err);
            } else {
                currentPasswordHash = hasher.computeHash(curentPassword, user.salt);

                if (user.passwordHash === currentPasswordHash) {
                    newPasswordHash = hasher.computeHash(newPassword, user.salt);

                    data.changePassword(userId, newPasswordHash, next);
                } else {                    
                    next({
                        message: 'Incorrect Current Password'
                    });
                }
            }
        });
    };

    auth.init = function (app) {
        //setup passport authentication
        passport.use(new localStrategy(userVerify));

        passport.serializeUser(function (user, next) {
            next(null, user.userId);
        });

        passport.deserializeUser(function (key, next) {
            data.getUser(key, function (err, user) {
                if (err) {
                    next(null, false, { message: "Failed to retrieve user" });
                } else {
                    next(null, user);
                }
            });
        })

        
        app.use(session({
            // cookie: { domain: 'localhost:8100' },
            secret: 'octopusSecret',
            saveUninitialized: true,
            resave: true,
            // using store session on MongoDB using express-session + connect
            store: new MongoStore(data.getDbParams())
            // {
            //    server: theDb.db
            //    //url: process.env.mongoUrl,
            //    //collection: 'sessions'
            //})
        }));
        app.use(passport.initialize());
        app.use(passport.session());

        app.get("/isauthenticated", auth.ensureAuthenticated, function (req, res) {
            if (req.user) {
                res.status(200).send(true);
            } else {
                res.status(200).send(false);
            }
        });

        app.get("/login", function (req, res) {
            res.render("index");
        });

        app.get("/login", function (req, res) {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.render("index");
        });

        app.post("/login", function (req, res, next) {
            var authFunction = passport.authenticate("local", function (err, user, info) {
                if (err) {
                    next(err);
                }

                if (!user) {
                    res.status(400).send('Invalid Credentials');
                    //return res.redirect('/login');
                }

                req.logIn(user, function (err) {
                    if (err) {
                        next(err);
                    } else {
                        res.status(200).send({ status: true });
                    }
                });
            });

            authFunction(req, res, next);
        });

        app.get("/register", function (req, res) {
            res.render("register", {
                title: "Register on The Board", message: req.flash("addUserError") });
        });

        app.post("/register", function (req, res) {
            if (req.body.userId && req.body.name && req.body.password) {
                var salt = hasher.createSalt();

                var user = {
                    name: req.body.name,
                    userId: req.body.userId,
                    passwordHash: hasher.computeHash(req.body.password, salt),
                    salt: salt,
                    profilePic: '',
                    leagues: [],
                    choices: []
                };

                data.addUser(user, function (err) {
                    if (err) {
                        res.status(500).send({ error : 'unable to create new user : ' + err });
                    } else {
                        res.status(201).send({ status: 'User Created' });
                    }
                });
            } else {
                res.status(400).send({ status: 'Bad Request' });
            }

        });

        app.get('/logout', function (req, res) {
            req.logout();
            res.status(200).send({ status: true });
        });
    }

})(module.exports);