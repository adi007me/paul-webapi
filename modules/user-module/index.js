(userModule => {
    const db = require('../../data');
    const allowedDomain = process.env.ALLOWED_DOMAIN

    userModule.createOrGetUser = (user, next) => {
        if (allowedDomain && !user.email.endsWith(allowedDomain)) {
            next('User not allowed', null)
        } else {
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
    }
})(module.exports);
