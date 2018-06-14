(function (betInfoData) {

    var database = require('./database');

    betInfoData.init = function (data) {
        data.getMatchBets = function (matchId, next) {            
            data.getLeagues(function (err, leagues) {
                if (err) {
                    next(err);
                } else {
                    let match = leagues[0].matches.filter(m => m.match_id === matchId);

                    if (!match || match.length == 0) {
                        next('Match not found');
                        return;
                    } else {
                        match[0].datetime.setHours(match[0].datetime.getHours() - 1);

                        if (match[0].datetime > new Date()) {
                            next('NotLocked');
                        } else {

                            findBetsByChoice(matchId, match[0].team1_id, function (err, usersOnTeam1) {
                                if (err) {
                                    next(err);
                                } else {
                                    findBetsByChoice(matchId, match[0].team2_id, function (err, usersOnTeam2) {
                                        if (err) {
                                            next(err);
                                        } else {
                                            findBetsByChoice(matchId, ['draw', '', null], function (err, usersOnDraw) {
                                                if (err) {
                                                    next(err);
                                                } else {
                                                    next(null, { team1: usersOnTeam1, team2: usersOnTeam2, draw: usersOnDraw });
                                                }
                                            });                                            
                                        }
                                    });
                                }
                            });       
                        }
                    }
                }
            });
        };
    }

    function findBetsByChoice(matchId, choices, callback) {
        if (!Array.isArray(choices)) {
            choices = [ choices ];
        }
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.find(
                    {
                        $and: [{
                            userId: { $ne: 'paul-admin' }
                        }
                            , {
                            choices: { $elemMatch: { match_id: matchId, choice: {$in: choices } } }
                        }]
                    })
                    .project({ "name": 1, "userId": 1, "_id": 0 }).toArray(callback);
            }
        });
    }
})(module.exports);