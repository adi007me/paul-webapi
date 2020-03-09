(function (choicesController) {
    'use strict';

    var authModule = require('../modules/auth-module');
    var data = require('../data');

    choicesController.init = function (app) {
        app.get('/choices', authModule.isLoggedIn, function (req, res) {
            if (req.user) {
                res.status(200).send(req.user.choices);
            } else {
                res.status(401).send('Unauthorized');
            }
        });

        app.post('/choices', authModule.isLoggedIn, function (req, res) {
            if (req.user) {
                if (req.user.userId !== 'paul-admin') {
                    console.log(req.body.choice);
                    var userId = req.user.userId;

                    data.updateChoice(userId, req.body.choice, function (err) {
                        if (err) {
                            res.status(500).send('Error updating choice: ' + err);
                        } else {
                            res.status(200).send(req.body.choice);
                        }
                    });
                } else {
                    res.status(401).send('Admin Not allowed to change choice');
                }
            } else {
                res.status(401).send('Unauthorized');
            }
        });
    }
    
})(module.exports);