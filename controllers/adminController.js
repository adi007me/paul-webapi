(function(admin) {
    'use strict';

    var authModule = require('../modules/auth-module');
    var data = require('../data');

    admin.init = function (app) {
        app.get('/admin', authModule.isAdmin, function (req, res) {
            data.getLeagues((err, leagues) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    const matches = leagues[0].matches;

                    res.render('admin', { matches });
                }
            })
        });

        app.post('/admin/lock', authModule.isAdmin, function (req, res) {
            if (req.user && req.user.userId === 'paul-admin') {
                var matchId = req.body.matchId;
                data.lockMatch(matchId, function () {
                    res.status(200).send('Done');
                })
            } else {
                res.status(401).send('Unauthorized');
            }
        });

        app.post('/admin/result', authModule.isAdmin, function (req, res) {
            var matchId = req.body.matchIdResult;
            var result = req.body.result;

            data.choices.updateResult(matchId, result).then(done => res.status(200).send(done))
                .catch(err => res.status(500).send(err));
        });
    }

})(module.exports);