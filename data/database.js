(async function (database){
    
    var MongoClient = require('mongodb').MongoClient;
    
    let mongoUrl = process.env.MONGO_URL;
    
    const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    // let dbName = mongoUrl.substr(mongoUrl.lastIndexOf("/") + 1);
    let dbName = 'paul-predictor';
 
    let theDb = null;
        
    database.getDb = function (next) {
        if (!theDb) {
            //connect to the DB
            client.connect(err => {
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


    await client.connect();
    const octopusDb = client.db(dbName);
                    
    theDb = {
        db: octopusDb,
        leagues: octopusDb.collection("leagues"),
        teams: octopusDb.collection("teams"),
        users: octopusDb.collection("users")
    };

    console.log('theDB Created', theDb !== null);
})(module.exports);