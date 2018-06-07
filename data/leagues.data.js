(function (leaguesData) {
    var database = require('./database');

    leaguesData.init = function (data) {
        data.getLeagues = function (next) {
            database.getDb(function (err, db) {
                if (err) {
                    next(err);
                } else {
                    db.leagues.find().sort({ startDate: -1 }).toArray(function (err, leagues) {
                        if (err) {
                            next(err, null);
                        } else {
                            next(null, leagues);
                        }
                    });
                }
            })
        }
    }    
})(module.exports);