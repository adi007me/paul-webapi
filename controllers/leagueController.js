(function (leagueController) {
    'use strict';
    var db = require('../data');
    var auth = require('../auth');
    const isSuspended = process.env.IS_SUSPENDED === 'true'

    leagueController.init = function (app) {
        app.get('/api/leagues', function (req, res) {
            db.getLeagues(function (err, leagues) {
                if (err) {
                    res.status(500).send('Internal Server Error while getting leagues');
                } else {
                    const lockDate = new Date();
                    lockDate.setHours(lockDate.getHours() + 1);

                    let matches = leagues[0].matches.filter(m => typeof(m.favTeam1) === "undefined" && m.datetime < lockDate);

                    leagues[0].isSuspended = isSuspended;

                    let promises = [];

                    if (matches.length) {
                        matches.forEach(m=> {
                            promises.push(lockMatch(m));
                        });

                        Promise.all(promises).then(() => {
                            res.status(200).send(leagues);
                        });
                    } else {
                        res.status(200).send(leagues);
                    }
                }
            });
        });

        function lockMatch(match) {
            return new Promise((resolve, reject) => {
                db.lockMatch(match.match_id, (err, lockResult) => {
                    if (err) reject(err);
                    else {
                        match.favTeam1 = lockResult.favTeam1;
                        match.favTeam2 = lockResult.favTeam2;
                        match.favDraw = lockResult.favDraw;

                        resolve(match);
                    }
                });
            })
        }
    }
})(module.exports);