(function (userController) {
    'use strict';
    var db = require('../data');
    var auth = require('../auth');
    const authModule = require('../modules/auth-module');

    userController.init = function (app) {


        app.get('/api/user/:id', function (req, res) {
            db.getLeagues(function (err, leagues) {
                if (err) {
                    res.status(500).send('Error getting leagues')
                } else {
                    const finishedMatches = (leagues[0].matches || []).filter(m => m.result)

                    const finishedMatchesIds = finishedMatches.map(m => m.match_id)
                    
                    const id = req.params.id;

                    db.getUserById(id, function (err, user) {
                        if (err || !user) {
                            res.status(500).send('Error getting user by id')
                        } else {
                            try {
                                const requiredMatches = user.choices.filter(c => finishedMatchesIds.includes(c.match_id))

                                const requiredMatchesById = requiredMatches.reduce((acc, choice) => ({...acc, [choice.match_id]: choice}), {})

                                const response = finishedMatches.map(fm => 
                                    ({
                                        ...fm,
                                        choice: requiredMatchesById[fm.match_id].choice,
                                        points: requiredMatchesById[fm.match_id].points,
                                    })
                                )
                                res.status(200).send(response)
                            } catch (err) {
                                console.log(err)
                                res.status(500).send('Something went wrong')
                            }
                        }
                    })
                }
            })
        });

        // app.post('/user', auth.ensureAuthenticated, function (req, res) {
        //     if (req.user && req.body.name && req.body.emailId) {
        //         db.updateUserInfo(req.user.userId, req.body.name, req.body.emailId, function (err) {
        //             if (err) {
        //                 res.status(500).send('Error updating user');
        //             } else {
        //                 res.status(200).send(getUserToSend(req.user));
        //             }
        //         });                
        //     } else {
        //         res.status(400).send('Bad Request : "name" and "emailId" is required in body');
        //     }
        // });

        // app.post('/user/profilePic', auth.ensureAuthenticated, function (req, res) {
        //     if (req.user && req.body.profilePic) {
        //         db.updateUserProfilePic(req.user.userId, req.body.profilePic, function (err) {
        //             if (err) {
        //                 res.status(500).send('Error updating profile pic');
        //             } else {
        //                 res.status(200).send('Success');
        //             }
        //         })
        //     } else {
        //         res.status(400).send('Bad Request : "profilePic" is required in body');
        //     }
        // });

        // app.post('/user/changePassword', auth.ensureAuthenticated, function (req, res) {
        //     if (req.user) {
        //         if (req.body.currentPassword && req.body.newPassword) {
        //             auth.changePassword(req.user.userId, req.body.currentPassword, req.body.newPassword, function (err) {
        //                 if (err) {
        //                     console.log('Change Password Failed, Incorrect Current Password, User: ' + req.user.userId)

        //                     res.status(500).send('Error occured');
        //                 } else {
        //                     res.status(200).send('Success');
        //                 }
        //             });
        //         } else {
        //             res.send(400).send('Bad Request: old and new password required');
        //         }
        //     } else {
        //         res.status(401).send('Unauthenticated');
        //     }
        // });

        // app.get('/user', auth.ensureAuthenticated, function (req, res) {
        //     if (req.user) {
        //         var userToSend = getUserToSend(req.user);

        //         res.status(200).send(userToSend);
        //     }
        // });

        // function getUserToSend(user) {
        //     return {
        //         choices: user.choices,
        //         emailId: user.emailId,
        //         name: user.name,
        //         profilePic: user.profilePic                
        //     };
        // }
    };
})(module.exports);