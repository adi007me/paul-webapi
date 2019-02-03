(function (registrationController) {
    'use strict';

    const registrationModule = require('../modules/registration.module');
    const data = require('../data');
    var hasher = require("../auth/hasher");

    registrationController.init = function (app) {
        app.get('/confirm/:uuid', (req, res) => {
            let uuid = req.params.uuid;
            
            registrationModule.confirmRegistration(uuid, () => {
                res.render('registrationConfirmation');
            });
        });

        app.get("/register", function (req, res) {
            res.render("register", {
                title: "Register on The Board"
            });
        });

        app.post("/register", function (req, res) {
            if (req.body.userId && req.body.name && req.body.password && req.body.emailId) {
                var salt = hasher.createSalt();

                var user = {
                    choices: [],
                    emailId: req.body.emailId,
                    leagues: [],
                    name: req.body.name,
                    passwordHash: hasher.computeHash(req.body.password, salt),
                    profilePic: '',
                    salt: salt,
                    userId: req.body.userId,
                    uuid: '',
                    verified: false
                };

                data.addUser(user, function (err) {
                    if (err) {
                        res.status(500).send({ error: 'unable to create new user : ' + err });
                    } else {
                    registrationModule.sendConfirmationEmail(user.emailId, (err, response) => {
                            if (err) {
                                res.status(500).send('Error sending confimration email');
                            } else {
                                registrationModule.setUuid(user.userId, response.uuid, () => {
                                    res.status(201).send({ status: 'User Created. Email Confirmation Pending' });
                                });
                            }
                        });
                    }
                });
            } else {
                res.status(400).send({ status: 'Bad Request' });
            }
        });
    }
})(module.exports);
