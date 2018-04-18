(function (leagueController) {
    'use strict';
    var db = require('../data');
    var auth = require('../auth');

    leagueController.init = function (app) {
        app.get('/leagues', function (req, res) {
            db.getLeagues(function (err, leagues) {
                if (err) {
                    res.status(500).send('Internal Server Error while getting leagues');
                } else {
                    var response = null;
                    res.status(200).send(leagues);
                }
            });
        });
    }
})(module.exports);