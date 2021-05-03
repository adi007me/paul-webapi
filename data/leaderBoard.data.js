(function (leaderBoardData) {

    var database = require('./database');

    leaderBoardData.init = function (data) {
        data.getLeaderBoard = function (next) {
            database.getDb(function (err, db) {
                if (err) {
                    next(err);
                } else {
                    let leaderBoard = {};
                    getPoints(db, function (err, leaderBoardResponse) {
                        if (err) {
                            next(err);
                        } else {
                            leaderBoard = leaderBoardResponse;

                            getWins(db, function (err, wins) {
                                if (err) {
                                    next(err);
                                } else {
                                    getLosses(db, function (err, losses) {
                                        if (err) {
                                            next(err);
                                        } else {
                                            leaderBoard.forEach(function (item) {
                                                item.losses = item.wins = 0
                                                if (wins && wins.some(w => w._id === item.userId)) {
                                                    item.wins = wins.find(w => w._id === item.userId).count;
                                                }

                                                if (losses && losses.some(w => w._id === item.userId)) {
                                                    item.losses = losses.find(w => w._id === item.userId).count;
                                                }

                                                item.totalMatches = item.wins + item.losses;
                                            });

                                            next(null, leaderBoard);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        };

        function getPoints(db, next) {
            db.users.aggregate([
                { $match: { userId: { $ne: "paul-admin" } } },
                { $project: { "_id": 1, "name": 1, "userId": 1, "pictureUrl": 1, "totalPoints": { $sum: "$choices.points" } } },
                { $sort: { totalPoints: -1, name: 1 } }
            ]).toArray(function (err, points) {
                if (err) {
                    next(err);
                } else {
                    next(null, points);
                }
            });
        }

        function getWins(db, next) {
            db.users.aggregate([
                {
                    "$unwind": "$choices"
                },
                {
                    "$match": {
                        "choices.points": {
                            $gt: 0
                        }
                    }
                },
                {
                    $group: { _id: "$userId", count: { $sum: 1 } }
                }
            ]).toArray(function (err, wins) {
                if (err) {
                    next(err);
                } else {
                    next(null, wins);
                }
            });
        }

        function getLosses(db, next) {
            db.users.aggregate([
                {
                    "$unwind": "$choices"
                },
                {
                    "$match": {
                        $or: [
                            {
                                "choices.points": {
                                    $eq: -10
                                }
                            }, {
                                "choices.points": {
                                    $eq: -25
                                }
                            }, {
                                "choices.points": {
                                    $eq: -50
                                }
                            }
                            ]
                    }
                },
                {
                    $group: { _id: "$userId", count: { $sum: 1 } }
                }
            ]).toArray(function (err, losses) {
                if (err) {
                    next(err);
                } else {
                    next(null, losses);
                }
            });
        }
    }

})(module.exports);