(function (choicesController) {
    'use strict';

    var authModule = require('../modules/auth-module');
    var data = require('../data');

    choicesController.init = function (app) {
        app.get('/api/choices', authModule.isLoggedIn, function (req, res) {
            if (req.user) {
                data.choices.getChoices(req.user.userId).then(choices => {
                    res.status(200).send(choices);
                }).catch(err => {
                    res.status(500).send(err);
                })
            } else {
                res.status(401).send('Unauthorized');
            }
        });

        app.post('/api/choices', authModule.isLoggedIn, function (req, res) {
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