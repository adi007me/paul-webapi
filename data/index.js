(function (data) {

    var database = require('./database');
    var leaderBoardData = require('./leaderBoard.data');
    var leaguesData = require('./leagues.data');
    var betInfoData = require('./betInfo.data');

    const registrationData = require('./registration.data');

    leaderBoardData.init(data);
    leaguesData.init(data);
    betInfoData.init(data);
    registrationData.init(data);

    data.addUser = function (user, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {                
                db.users.findOne({ userId: user.userId }, function (err, result) {
                    if (err) {
                        next(err);
                    } else if(result) {
                        next('Duplicate UserName');
                    } else {
                        user.choices = initialChoices;
                        db.users.insert(user, next);
                    }
                });
            }
        });
    };

    data.getUser = function (userName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({ userId: userName }, next);
            }
        });
    };

    data.getDbParams = function () {
        return database.getDbParams();
    }

    data.updateChoice = function (userId, choice, next) {
        if (choice) {
            database.getDb(function (err, db) {
                if (err) {
                    next(err);
                } else {
                    data.getLeagues(function (err, leagues) {
                        if (err) {
                            next('Unable to get leagues');
                        } else {                                            
                            let match = leagues[0].matches.filter(m => m.match_id === choice.match_id);
                            if (match && match.length > 0) {
                                match[0].datetime.setHours(match[0].datetime.getHours() - 1);
                                //console.log(match[0].datetime < new Date());

                                if (match[0].datetime > new Date()) {

                                    db.users.findOne(
                                        {
                                            userId: userId, "choices.match_id": choice.match_id
                                        }, function (err, result) {
                                            if (err) {
                                                next(err)
                                            } else {
                                                if (result) {
                                                    db.users.updateOne(
                                                        {
                                                            userId: userId, "choices.match_id": choice.match_id
                                                        },
                                                        {
                                                            $set: { "choices.$.choice": choice.choice },
                                                        }
                                                        , function (err, res) {
                                                            if (err) {
                                                                console.log('Error in choice update for user: ' + userId);
                                                                next(err);
                                                            } else {
                                                                console.log('Choice updated for user: ' + userId);
                                                                next(null);
                                                            }
                                                        });
                                                } else {
                                                    db.users.updateOne(
                                                        {
                                                            userId: userId,
                                                        },
                                                        {
                                                            $push: {
                                                                choices: {
                                                                    $each: [{
                                                                        "match_id": choice.match_id,
                                                                        "choice": choice.choice,
                                                                        "points": 0
                                                                    }]
                                                                }
                                                            }
                                                        },
                                                        function (err, res) {
                                                            if (err) {
                                                                console.log('Error in choice update for user: ' + userId);
                                                                next(err);
                                                            } else {
                                                                console.log('Choice updated for user: ' + userId);
                                                                next(null);
                                                            }
                                                        }
                                                    )
                                                }
                                            }
                                        }
                                    );
                                } else {
                                    next('Cannot update. Time expired for : ' + choice.match_id);
                                }
                            } else {
                                next('Unable to find match with ID: ' + choice.match_id);
                            }
                        }
                    });
                }
            });
        } else {
            next('choice is null');
        }
    }

    data.updateUserInfo = function (userId, name, email, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.updateOne(
                    { userId: userId },
                    {
                        $set: {
                            name: name,
                            emailId: email
                        }
                    }, function (err, res) {
                        if (err) {
                            console.log('Error in update user: ' + userId);
                            next(err);
                        } else {
                            console.log('Updated for user: ' + userId);
                            next(null);
                        }
                    });

            }
        });
    };

    data.updateUserProfilePic = function (userId, profilePic, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.updateOne(
                    { userId: userId },
                    {
                        $set: {
                            profilePic: profilePic,
                        }
                    }, function (err, res) {
                        if (err) {
                            console.log('Error in updating profile pic for user: ' + userId);
                            next(err);
                        } else {
                            console.log('Updated profile pic for user: ' + userId);
                            next(null);
                        }
                    });

            }
        });
    };

    data.changePassword = function (userId, newPasswordHash, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.updateOne(
                    { userId: userId },
                    {
                        $set: {
                            passwordHash: newPasswordHash
                        }
                    }, function (err, res) {
                        if (err) {
                            console.log('Error Updating Password, userId: ' + userId);
                            next(err);
                        } else {
                            next(null);
                        }
                    }
                );
            }
        });
    };

    data.getTeams = function (next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.teams.find().toArray(function (err, teams) {
                    if (err) {
                        next(err);
                    }
                    next(null, teams);
                });
            }
        });
    }

    data.lockMatch = function (matchId, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.count({}, function (err, userCount) {
                    data.getLeagues(function (err, leagues) {
                        if (err) {
                            next(err);
                        } else {
                            let match = leagues[0].matches.filter(m => m.match_id === matchId);

                            if (!match || match.length == 0) {
                                next('Match not found');
                                return;
                            } else {
                                db.users.count(
                                    { choices: { $elemMatch: { match_id: matchId, choice: match[0].team1_id } } }
                                    , function (err, choice1Count) {

                                        db.users.count({ choices: { $elemMatch: { match_id: matchId, choice: { $in: ['draw', '', null] } } } }
                                            , function (err, drawCount) {
                                                let favTeam1 = choice1Count;
                                                let favDraw = drawCount;
                                                let favTeam2 = userCount - favTeam1 - favDraw - 1;

                                                db.leagues.updateOne(
                                                    {
                                                        "matches.match_id": matchId
                                                    },
                                                    {
                                                        $set: {
                                                            "matches.$.favTeam1": favTeam1,
                                                            "matches.$.favTeam2": favTeam2,
                                                            "matches.$.favDraw": favDraw
                                                        }
                                                    }
                                                    , function (err, res) {
                                                        if (err) {
                                                            console.log('Error locking match: ' + matchId);
                                                            next(err);
                                                        } else {
                                                            console.log('Locked Match ' + matchId);
                                                            next('Done');
                                                        }
                                                    });
                                            });
                                    });
                            }
                        }                        
                    })                                        
                });
            }
        });
    }

    data.updateResult = function (matchId, result, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.leagues.updateOne(
                    {
                        "matches.match_id": matchId
                    },
                    {
                        $set: {
                            "matches.$.result": result,
                        }
                    }
                    , function (err, res) {
                        if (err) {
                            console.log('Error setting match result: ' + matchId);
                            next(err);
                        } else {

                            data.getLeagues(function (err, leagues) {
                                if (err) {
                                    console.log('Error setting match result: ' + matchId);
                                    next(err);
                                } else {
                                    let matches = leagues[0].matches.filter(m => m.match_id === matchId);

                                    let match = matches[0];
                                    let pointsForMatch = 0;
                                    let points = 0;
                                    let favDraw = match.favDraw | 0;

                                    if (match.match_id.includes('match')) {
                                        pointsForMatch = 10;
                                    } else if (match.match_id.includes('sm')) {
                                        pointsForMatch = 25;
                                    } else if (match.match_id.includes('final')) {
                                        pointsForMatch = 50;
                                    }

                                    if (result == match.team1_id) {
                                        points = (match.favTeam2 + match.favDraw) / match.favTeam1 * pointsForMatch;
                                    } else if (result == match.team2_id) {
                                        points = (match.favTeam1 + match.favDraw) / match.favTeam2 * pointsForMatch;
                                    } else if (result == 'draw') {
                                        points = (match.favTeam1 + match.favTeam2) / match.favDraw * pointsForMatch;
                                    }

                                    db.users.updateMany(
                                        {
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
                    });
            }
        });
    }

    const initialChoices = 
        [
            {
                "match_id": "fifa.match1",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match2",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match3",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match4",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match5",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match6",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match7",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match8",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match9",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match10",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match11",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match12",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match13",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match14",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match15",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match16",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match17",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match18",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match19",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match20",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match21",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match22",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match23",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match24",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match25",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match26",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match27",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match28",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match29",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match30",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match31",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match32",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match33",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match34",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match35",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match36",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match37",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match38",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match39",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match40",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match41",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match42",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match43",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match44",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match45",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match46",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match47",
                "choice": "draw",
                "points": 0
            },
            {
                "match_id": "fifa.match48",
                "choice": "draw",
                "points": 0
            }
        ];
    

}(module.exports));