(function (database){
    
    var MongoClient = require('mongodb').MongoClient;
    let vcap_services = JSON.parse(process.env.VCAP_SERVICES || '{}');
    let mongoUrl = '';
    if (vcap_services.mlab) {
        mongoUrl = vcap_services.mlab[0].credentials.uri;        
    } else {
        mongoUrl = 'mongodb://127.0.0.1:27017/octopus';
    }

    let dbName = mongoUrl.substr(mongoUrl.lastIndexOf("/") + 1);
    
    console.log(mongoUrl);
    console.log(dbName);

    let theDb = null;
        
    database.getDb = function (next) {
        if (!theDb) {
            //connect to the DB
            MongoClient.connect(database.getDbParams().url, function (err, client) {
                if (err) {
                    next(err, null);
                } else {
                    const octopusDb = client.db(dbName);

                    theDb = {
                        db: octopusDb,
                        leagues: octopusDb.collection("leagues"),
                        teams: octopusDb.collection("teams"),
                        users: octopusDb.collection("users")
                    };

                    next(null, theDb);
                }
            })
        } else {
            next(null, theDb);
        }
    }

    database.getDbParams = function () {
        return {
            url: mongoUrl
        };
    };
})(module.exports);