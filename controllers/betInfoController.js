(function (betInfo) {

    var auth = require('../auth');
    var data = require('../data');

    betInfo.init = function (app) {
        app.get('/matchbets/:matchId', auth.ensureAuthenticated, function (req, res) {
            let matchId = req.params.matchId;

            if (matchId) {
                data.getMatchBets(matchId, function (err, matchBets) {
                    if (err) {
                        if (err.indexOf('Match not found') > -1 || err.indexOf('NotLocked') > -1) {
                            res.status(400).send({ status: 'Bad Request: ' + err });
                        } else {
                            res.status(500).send({ status: 'Internal Error: ' + err });
                        }
                    } else {
                        res.status(200).send(matchBets);
                    }
                });
            } else {
                res.status(401).send('Match ID is required');
            }
        });
    };

})(module.exports);