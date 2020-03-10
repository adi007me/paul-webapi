(userModule => {
    const db = require('../../data');

    userModule.createOrGetUser = (user, next) => {
        db.getUser(user.email, (err, dbUser) => {
            if (err) {
                next(err);
            } else if (dbUser) {
                console.log('dbUser', dbUser);
                next(null, dbUser);
            } else {
                // add user
                db.addUser({ ...user, userId: user.email }, next);
            }
        })
    }
})(module.exports);
