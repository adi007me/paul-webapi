((authModule) => {
    
    const admins = process.env.ADMINS.split(',')
    const oauthKey = process.env.OAUTH_KEY
    
    authModule.authenticate = (token) => {
        return new Promise((resolve, reject) => {
            const {OAuth2Client} = require('google-auth-library');
            const client = new OAuth2Client(oauthKey);

            async function verify() {
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: oauthKey,
                });
                const payload = ticket.getPayload();

                const response = {
                    email: payload['email'],
                    name: payload['name'],
                    userId: payload['email'],
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

            if (req.user.isAdmin) {
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
                req.user = JSON.parse(currentUser);
                req.user.isAdmin = Boolean(admins.indexOf(req.user.email) > -1);
            }
        }
    }
})(module.exports);