(authenticationController => {
    const authModule = require('../modules/auth-module');
    const cryptoModule = require('../modules/crypto-module');
    
    authenticationController.init = app => {
        console.log('authenticationController.init')
        app.get('/authenticate', (req, res) => {
            const token = req.query.token;
            console.log('Current User:', req.currentUser);

            authModule.authenticate(token).then((user) => {
                if (req.currentUser) {
                    if (req.currentUser.userid === user.userid) {
                        res.status(401).send('Unauthorized');
                    } else {
                        res.status(200).send(user);
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
    };

})(module.exports);
