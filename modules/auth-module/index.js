((authModule) => {
    
    const admins = [
        'adi007me@gmail.com'
    ];
    
    authModule.authenticate = (token) => {
        return new Promise((resolve, reject) => {
            const {OAuth2Client} = require('google-auth-library');
            const client = new OAuth2Client('169706668013-mvf7ct27e5n709k27cdqd2ostnvoe1qm.apps.googleusercontent.com');

            async function verify() {
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: '169706668013-mvf7ct27e5n709k27cdqd2ostnvoe1qm.apps.googleusercontent.com',
                });
                const payload = ticket.getPayload();

                const response = {
                    email: payload['email'],
                    name: payload['name'],
                    userid: payload['sub'],
                    pictureUrl: payload['picture']
                };

                resolve(response);
            }

            verify().catch(error => {
                console.error(error);
                reject(error);
            });
        });
    };

    authModule.setCurrentUser = (req, res, next) => {
        setCurrentUser(req);

        next();
    };

    authModule.isLoggedIn = (req, res, next) => {
        if (req.cookies['paul-auth']) {
            next();
        } else {
            res.status(401).send('Not Authenticated');
        }
    };

    authModule.isAdmin = (req, res, next) => {
        if (req.cookies['paul-auth']) {
            setCurrentUser(req);

            if (req.currentUser.isAdmin) {
                next();
            } else {
                res.status(401).send('Unauthorized. Not an Admin to perform this operation');
            }
        } else {
            res.status(401).send('Not Authenticated');
        }
    };

    setCurrentUser = (req) => {
        if (req.cookies['paul-auth']) {
            const cryptoModule = require('../../modules/crypto-module');
            const currentUser = cryptoModule.decrypt(req.cookies['paul-auth']);

            if (currentUser) {
                req.currentUser = JSON.parse(currentUser);
                req.currentUser.isAdmin = Boolean(admins.indexOf(req.currentUser.email) > -1);
            }
        }
    }
})(module.exports);