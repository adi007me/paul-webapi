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
    };

})(module.exports);