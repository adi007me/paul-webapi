(function (leaderBoard) {

    'use strict';

    var auth = require('../auth');
    var data = require('../data');

    leaderBoard.init = function (app) {
        app.get('/leaderboard', function (req, res) {
            data.getLeaderBoard(function (err, leaderBoard) {
                if (err) {
                    res.status(500).send({ status: err });
                } else {
                    res.status(200).send(leaderBoard);
                }
            });
        });
    };    

})(module.exports);