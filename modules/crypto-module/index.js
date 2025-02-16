((cryptoModule) => {    
    const crypto = require('crypto');
    const key = process.env.CRYPTO_KEY || 'paul-predictor-key'

    cryptoModule.encrypt = (data) => {      
        const cipher = crypto.createCipher('aes-192-cbc', key);

        let cipherUser = cipher.update(data, 'utf8', 'hex');

        cipherUser += cipher.final('hex');

        return cipherUser;
    };

    cryptoModule.decrypt = (encryptedData) => {
        const deCipher = crypto.createDecipheriv('aes-192-cbc', key);
        let user = deCipher.update(encryptedData, 'hex', 'utf8');

        console.log(user);

        user += deCipher.final('utf8');

        return user;
    }
})(module.exports);