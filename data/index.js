(function (data) {

    var database = require('./database');
    var leaderBoardData = require('./leaderBoard.data');

    leaderBoardData.init(data);

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

    data.getLeagues = function (next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                console.log('Leagues');
                db.leagues.find().toArray(function (err, leagues) {
                    if (err) {
                        next(err, null);
                    } else {
                        next(null, leagues);
                    }
                });
            }
        })
    }

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
                                match[0].datetime.setHours(match[0].datetime.getHours() - 2);
                                console.log(match[0].datetime < new Date());

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
                                        let favTeam1 = choice1Count - 1;
                                        let favTeam2 = userCount - favTeam1 - 1;

                                        db.leagues.updateOne(
                                            {
                                                "matches.match_id": matchId
                                            },
                                            {
                                                $set: {
                                                    "matches.$.favTeam1": favTeam1,
                                                    "matches.$.favTeam2": favTeam2
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
                                    let loosingTeam = '';

                                    if (match.match_id.includes('match')) {
                                        pointsForMatch = 10;
                                    } else if (match.match_id.includes('sm')) {
                                        pointsForMatch = 25;
                                    } else if (match.match_id.includes('final')) {
                                        pointsForMatch = 50;
                                    }

                                    if (result == match.team1_id) {
                                        points = match.favTeam2 / match.favTeam1 * pointsForMatch;
                                        loosingTeam = match.team2_id;
                                    } else {
                                        points = match.favTeam1 / match.favTeam2 * pointsForMatch;
                                        loosingTeam = match.team1_id;
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
                                                                "choice": loosingTeam
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

    data.getMatchBets = function (matchId, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                data.getLeagues(function (err, leagues) {
                    if (err) {
                        next(err);
                    } else {
                        let match = leagues[0].matches.filter(m => m.match_id === matchId);

                        if (!match || match.length == 0) {
                            next('Match not found');
                            return;
                        } else {
                            match[0].datetime.setHours(match[0].datetime.getHours() - 2);
                            
                            if (match[0].datetime > new Date()) {
                                next('NotLocked');
                            } else {
                                db.users.find(
                                    {
                                        $and: [{
                                            userId: { $ne: 'paul-admin' }
                                        }
                                            , {
                                            choices: { $elemMatch: { match_id: matchId, choice: match[0].team1_id } }
                                        }]
                                    })
                                    .project({ "name": 1, "userId": 1, "_id": 0 }).toArray(
                                    function (err, usersOnTeam1) {
                                        if (err) {
                                            next(err);
                                        } else {
                                            db.users.find(
                                                {
                                                    $and: [{
                                                        userId: { $ne: 'paul-admin' }
                                                    }
                                                        , {
                                                        choices: { $elemMatch: { match_id: matchId, choice: match[0].team2_id } }
                                                    }]
                                                })
                                                .project({ "name": 1, "userId": 1, "_id": 0 }).toArray(
                                                function (err, usersOnTeam2) {
                                                    if (err) {
                                                        next(err);
                                                    } else {
                                                        console.log({ team1: usersOnTeam1, team2: usersOnTeam2 });
                                                        next(null, { team1: usersOnTeam1, team2: usersOnTeam2 });
                                                    }
                                                }
                                                );
                                        }
                                    }
                                    );
                            }
                        }
                    }
                });
            }
        });
    };

    const initialChoices = 
        [
            {
                "match_id": "match1",
                "choice": "MI",
                "points": 0
            },
            {
                "match_id": "match2",
                "choice": "DD",
                "points": 0
            },
            {
                "match_id": "match3",
                "choice": "KKR",
                "points": 0
            },
            {
                "match_id": "match4",
                "choice": "SRH",
                "points": 0
            },
            {
                "match_id": "match5",
                "choice": "CSK",
                "points": 0
            },
            {
                "match_id": "match6",
                "choice": "RR",
                "points": 0
            },
            {
                "match_id": "match7",
                "choice": "SRH",
                "points": 0
            },
            {
                "match_id": "match8",
                "choice": "RCB",
                "points": 0
            },
            {
                "match_id": "match9",
                "choice": "MI",
                "points": 0
            },
            {
                "match_id": "match10",
                "choice": "KKR",
                "points": 0
            },
            {
                "match_id": "match11",
                "choice": "RCB",
                "points": 0
            },
            {
                "match_id": "match12",
                "choice": "KXIP",
                "points": 0
            },
            {
                "match_id": "match13",
                "choice": "KKR",
                "points": 0
            },
            {
                "match_id": "match14",
                "choice": "MI",
                "points": 0
            },
            {
                "match_id": "match15",
                "choice": "RR",
                "points": 0
            },
            {
                "match_id": "match16",
                "choice": "KXIP",
                "points": 0
            },
            {
                "match_id": "match17",
                "choice": "CSK",
                "points": 0
            },
            {
                "match_id": "match18",
                "choice": "KKR",
                "points": 0
            },
            {
                "match_id": "match19",
                "choice": "DD",
                "points": 0
            },
            {
                "match_id": "match20",
                "choice": "SRH",
                "points": 0
            },
            {
                "match_id": "match21",
                "choice": "RR",
                "points": 0
            },
            {
                "match_id": "match22",
                "choice": "RR",
                "points": 0
            },
            {
                "match_id": "match23",
                "choice": "KXIP",
                "points": 0
            },
            {
                "match_id": "match24",
                "choice": "MI",
                "points": 0
            },
            {
                "match_id": "match25",
                "choice": "RCB",
                "points": 0
            },
            {
                "match_id": "match26",
                "choice": "SRH",
                "points": 0
            },
            {
                "match_id": "match27",
                "choice": "DD",
                "points": 0
            },
            {
                "match_id": "match28",
                "choice": "CSK",
                "points": 0
            },
            {
                "match_id": "match29",
                "choice": "RR",
                "points": 0
            },
            {
                "match_id": "match30",
                "choice": "RCB",
                "points": 0
            },
            {
                "match_id": "match31",
                "choice": "CSK",
                "points": 0
            },
            {
                "match_id": "match32",
                "choice": "RCB",
                "points": 0
            },
            {
                "match_id": "match33",
                "choice": "DD",
                "points": 0
            },
            {
                "match_id": "match34",
                "choice": "KKR",
                "points": 0
            },
            {
                "match_id": "match35",
                "choice": "KXIP",
                "points": 0
            },
            {
                "match_id": "match36",
                "choice": "CSK",
                "points": 0
            },
            {
                "match_id": "match37",
                "choice": "SRH",
                "points": 0
            },
            {
                "match_id": "match38",
                "choice": "MI",
                "points": 0
            },
            {
                "match_id": "match39",
                "choice": "KXIP",
                "points": 0
            },
            {
                "match_id": "match40",
                "choice": "SRH",
                "points": 0
            },
            {
                "match_id": "match41",
                "choice": "RR",
                "points": 0
            },
            {
                "match_id": "match42",
                "choice": "KKR",
                "points": 0
            },
            {
                "match_id": "match43",
                "choice": "DD",
                "points": 0
            },
            {
                "match_id": "match44",
                "choice": "RR",
                "points": 0
            },
            {
                "match_id": "match45",
                "choice": "KXIP",
                "points": 0
            },
            {
                "match_id": "match46",
                "choice": "RCB",
                "points": 0
            },
            {
                "match_id": "match47",
                "choice": "CSK",
                "points": 0
            },
            {
                "match_id": "match48",
                "choice": "MI",
                "points": 0
            },
            {
                "match_id": "match49",
                "choice": "KXIP",
                "points": 0
            },
            {
                "match_id": "match50",
                "choice": "KKR",
                "points": 0
            },
            {
                "match_id": "match51",
                "choice": "MI",
                "points": 0
            },
            {
                "match_id": "match52",
                "choice": "RCB",
                "points": 0
            },
            {
                "match_id": "match53",
                "choice": "DD",
                "points": 0
            },
            {
                "match_id": "match54",
                "choice": "RR",
                "points": 0
            },
            {
                "match_id": "match55",
                "choice": "SRH",
                "points": 0
            },
            {
                "match_id": "match56",
                "choice": "DD",
                "points": 0
            },
            {
                "match_id": "match57",
                "choice": "CSK",
                "points": 0
            }
        ];
    

}(module.exports));