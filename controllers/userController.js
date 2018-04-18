(function (userController) {
    'use strict';
    var db = require('../data');
    var auth = require('../auth');

    userController.init = function (app) {
        app.get('/user', auth.ensureAuthenticated, function (req, res) {
            if (req.user) {
                var userToSend = getUserToSend(req.user);

                res.status(200).send(userToSend);
            }
        });

        app.post('/user', auth.ensureAuthenticated, function (req, res) {
            if (req.user && req.body.name && req.body.emailId) {
                db.updateUserInfo(req.user.userId, req.body.name, req.body.emailId, function (err) {
                    if (err) {
                        res.status(500).send('Error updating user');
                    } else {
                        res.status(200).send(getUserToSend(req.user));
                    }
                });                
            } else {
                res.status(400).send('Bad Request : "name" and "emailId" is required in body');
            }
        });

        app.post('/user/profilePic', auth.ensureAuthenticated, function (req, res) {
            if (req.user && req.body.profilePic) {
                db.updateUserProfilePic(req.user.userId, req.body.profilePic, function (err) {
                    if (err) {
                        res.status(500).send('Error updating profile pic');
                    } else {
                        res.status(200).send('Success');
                    }
                })
            } else {
                res.status(400).send('Bad Request : "profilePic" is required in body');
            }
        });

        app.post('/user/changePassword', auth.ensureAuthenticated, function (req, res) {
            if (req.user) {
                if (req.body.currentPassword && req.body.newPassword) {
                    auth.changePassword(req.user.userId, req.body.currentPassword, req.body.newPassword, function (err) {
                        if (err) {
                            console.log('Change Password Failed, Incorrect Current Password, User: ' + req.user.userId)

                            res.status(500).send('Error occured');
                        } else {
                            res.status(200).send('Success');
                        }
                    });
                } else {
                    res.send(400).send('Bad Request: old and new password required');
                }
            } else {
                res.status(401).send('Unauthenticated');
            }
        });

        function getUserToSend(user) {
            return {
                choices: user.choices,
                emailId: user.emailId,
                name: user.name,
                profilePic: user.profilePic                
            };
        }
    };
})(module.exports);