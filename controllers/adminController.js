(function(admin) {
    'use strict';

    var auth = require('../auth');
    var data = require('../data');

    admin.init = function (app) {
        app.get('/admin', auth.ensureAuthenticated, function (req, res) {
            if (req.user && req.user.userId === 'paul-admin') {
                res.render('admin');
            } else {
                res.status(401).send('Unauthorized');
            }
        });

        app.post('/admin/lock', auth.ensureAuthenticated, function (req, res) {
            if (req.user && req.user.userId === 'paul-admin') {
                var matchId = req.body.matchId;
                data.lockMatch(matchId, function () {
                    res.status(200).send('Done');
                })
            } else {
                res.status(401).send('Unauthorized');
            }
        });

        app.post('/admin/result', auth.ensureAuthenticated, function (req, res) {
            if (req.user && req.user.userId === 'paul-admin') {
                var matchId = req.body.matchIdResult;
                var result = req.body.result;

                data.updateResult(matchId, result, function (err, done) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.status(200).send(done);
                    }
                });
            } else {
                res.status(401).send('Unauthorized');
            }
        });
    }

})(module.exports);