(choicesData => {

    const database = require('./database');
    
    choicesData.init = data => {
        data.choices = {};
        
        data.choices.getChoices = userId => {
            return new Promise((resolve, reject) => {
                database.getDb(function (err, db) {
                    if (err) {
                        reject(err);
                    } else {
                        db.users.findOne({ userId: userId }, (err, user) => {
                            if (err) {
                                reject(err);
                            } else if (!user) {
                                reject('User Not Found');
                            } else {
                                resolve(user.choices);
                            }
                        });
                    }
                });
            });
        }

        function getChoiceCountForMatch(matchId) {
            return new Promise((resolve, reject) => {
                database.getDb(function (err, db) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {                        
                        //update missing choices
                        data.getLeagues((err, leagues) => {
                            if (err) { 
                                reject(err);
                            } else {
                                const matchFilter = leagues[0].matches.filter(m => m.match_id === matchId);

                                let match = null;
                                
                                if (matchFilter.length) {
                                    match = matchFilter[0];
                                } else {
                                    reject('Match not found', matchId);
                                }

                                let team1ChoiceCount = 0;
                                let team2ChoiceCount = 0;
                                let drawChoiceCount = 0;

                                getChoiceCount(db, matchId, match.team1_id).then(count1 => {
                                    team1ChoiceCount = count1;

                                    getChoiceCount(db, matchId, match.team2_id).then(count2 => {                                        
                                        team2ChoiceCount = count2;

                                        db.users.countDocuments({}, function (err, userCount) {
                                            if (err) reject(err)
                                            else {
                                                drawChoiceCount = userCount - team1ChoiceCount - team2ChoiceCount;
                                                
                                                resolve({
                                                    team1: team1ChoiceCount,
                                                    team2: team2ChoiceCount,
                                                    draw: drawChoiceCount,
                                                    match: match
                                                });
                                            }
                                        });
                                    }).catch(err => reject(err));
                                }).catch(err => reject(err));
                            }
                        });
                    }
                });
            });
        };

        // data.choices.updateMissingChoices = matchId => {
        //     return new Promise((resolve, reject) => {
        //         db.users.find({ choices: { $elemMatch: { match_id: matchId, choice: { $in: ['draw', '', null] } } } }
        //         , function (err, usersWithNoChoice) {
        //             if(err) reject(err);
        //             else {

        //             }
        //         });
        //     });
        // }

        data.choices.updateResult = (matchId, result) => {
            return new Promise((resolve, reject) => {                
                getChoiceCountForMatch(matchId).then(choices => {
                    let pointsForMatch = 0;
                    let points = 0;

                    let match = choices.match;

                    if (match.match_id.includes('match')) {
                        pointsForMatch = 10;
                    } else if (match.match_id.includes('sm')) {
                        pointsForMatch = 25;
                    } else if (match.match_id.includes('final')) {
                        pointsForMatch = 50;
                    }                    

                    if (result == match.team1_id && choices.team1 > 0) {
                        points = (choices.team2 + choices.draw) / choices.team1 * pointsForMatch;
                    } else if (result == match.team2_id && choices.team2 > 0) {
                        points = (choices.team1 + choices.draw) / choices.team2 * pointsForMatch;
                    } else if (result == 'draw' && choices.draw > 0) {
                        points = (choices.team1 + choices.team2) / choices.draw * pointsForMatch;
                    }

                    if (points === 0) {
                        points = 0.00000000001;
                    }

                    updatePoints(matchId, result, points, pointsForMatch, (err, done) => {
                        if (err) {
                            reject(err);
                        } else {
                            updateLeagueMatch(matchId, result).then(() =>{
                                resolve(done);
                            }).catch(err => reject(err));                            
                        }
                    });
                }).catch(err => reject(err));
            });
        };

        function updateLeagueMatch(matchId, result) {
            return new Promise((resolve, reject) => {
                database.getDb(function (err, db) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        db.leagues.updateOne(
                        {
                            "matches.match_id": matchId
                        },
                        {
                            $set: {
                                "matches.$.result": result,
                            }
                        }, (err, done) => {
                            if (err) reject(err);
                            else {
                                resolve(done);
                            }
                        });
                    }
                });                
            });            
        }

        function getChoiceCount(db, matchId, choice) {
            return new Promise((resolve, reject) => {
                db.users.countDocuments(
                    { choices: { $elemMatch: { match_id: matchId, choice: choice } } }, (err, count) => {                    
                        if (err) {
                            reject (err);
                        } else {
                            resolve(count);
                        }
                    }
                );
            });
        }

        function updatePoints(matchId, result, points, pointsForMatch, next) {
            database.getDb(function (err, db) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else { 
                    db.users.updateMany({
                        "choices": {
                            "$elemMatch": {
                                "match_id": matchId,
                                "choice": result
                            }
                        }
                    },
                    { $set: { "choices.$.points": points } }
                    , function (err) {
                        if (err) {
                            console.log(err);
                            next(err);
                        } else {
                            db.users.updateMany(
                                {
                                    "choices": {
                                        "$elemMatch": {
                                            "match_id": matchId,
                                            "choice": { $ne: result }
                                        }
                                    }
                                },
                                { $set: { "choices.$.points": (pointsForMatch*(-1)) } }
                                , function (err) {
                                    if (err) {
                                        console.log(err);
                                        next(err);
                                    } else {
                                        next(null, 'Done');
                                    }                                                    
                                });
                        }
                    });
                }
            });
        }
    };

})(module.exports);