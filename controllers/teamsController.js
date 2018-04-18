(function (teamsController) {
    'use strict';

    var data = require('../data');

    teamsController.init = function (app) {
        app.get('/teams', function (req, res) {
            data.getTeams(function (err, teams) {
                if (err) {
                    console.log(err);
                    res.status(500).send({ status: 'Error Occured' });
                } else {
                    res.status(200).send(teams);
                }
            })
        });
    }

})(module.exports);