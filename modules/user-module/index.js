(userModule => {
    const db = require('../../data');

    userModule.createOrGetUser = (user, next) => {
        db.getUser(user.email, (err, dbUser) => {
            if (err) {
                console.log('user module err', err);
                next(err);
            } else if (dbUser) {
                console.log('user module else if', user);
                next(null, dbUser);
            } else {
                console.log('user module add user');
                // add user
                db.addUser({userId: user.email}, next);
            }
        })
    }
})(module.exports);
