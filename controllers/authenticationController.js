(authenticationController => {
    const authModule = require('../modules/auth-module');
    const cryptoModule = require('../modules/crypto-module');
    
    authenticationController.init = app => {
        app.get('/auth/loggedin', (req, res) => {
            const token = req.query.token;
            
            authModule.authenticate(token).then((user) => {
                if (req.currentUser) {
                    if (req.currentUser.userid === user.userid) {
                        res.status(200).send(user);
                    } else {
                        res.status(401).send('Unauthorized');
                    }
                } else {
                    const encryptedUser = cryptoModule.encrypt(JSON.stringify(user));

                    var expirationDate = new Date();

                    expirationDate.setDate(expirationDate.getDate() + 1);

                    res.cookie('paul-auth', encryptedUser, {expires: expirationDate});

                    res.status(200).send(user);
                }
            }, error => {
                res.status(500).send('Authentication Failed');
            });
        });

        app.get('/auth/logout', (req, res) => {
            var expirationDate = new Date();

            expirationDate.setDate(expirationDate.getDate() - 2);

            res.cookie('paul-auth', 'logout', {expires: expirationDate});

            res.status(200).send({'status': 'success'});
        });
    };

})(module.exports);
