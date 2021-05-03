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
                            const sortedLeagues = [...leagues]
                            
                            sortedLeagues[0].matches = sortedLeagues[0].matches.sort((m1, m2) => { return (m2.datetime < m1.datetime) ? 1 : -1 });
                            next(null, sortedLeagues);
                        }
                    });
                }
            })
        }
    }    
})(module.exports);