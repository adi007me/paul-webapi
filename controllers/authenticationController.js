(authenticationController => {
    const authModule = require('../modules/auth-module');
    const cryptoModule = require('../modules/crypto-module');
    const userModule = require('../modules/user-module');
    
    authenticationController.init = app => {
        app.get('/auth/loggedin', (req, res) => {
            const token = req.query.token;
            
            authModule.authenticate(token).then((user) => {
                if (req.user) {
                    if (req.user.userId === user.userId) {
                        res.status(200).send(user);
                    } else {
                        res.status(401).send('Unauthorized');
                    }
                } else {
                    userModule.createOrGetUser(user, (err, dbUser) => {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            const encryptedUser = cryptoModule.encrypt(JSON.stringify(user));

                            var expirationDate = new Date();

                            expirationDate.setDate(expirationDate.getDate() + 1);

                            let cookieOptions = { expires: expirationDate }
                            if (process.env.ENVIRONMENT === 'PROD') {
                                cookieOptions = { ...cookieOptions, httpOnly: true, secure: true, sameSite: 'NONE' }
                            }

                            res.cookie('paul-auth', encryptedUser, cookieOptions);

                            res.status(200).send(user);
                        }
                    });                    
                }
            }, error => {
                res.status(500).send('Authentication Failed');
            });
        });

        app.get('/auth/logout', (req, res) => {
            var expirationDate = new Date();

            expirationDate.setDate(expirationDate.getDate() - 2);

            res.clearCookie('paul-auth');

            res.status(200).send({'status': 'success'});
        });
    };

})(module.exports);
