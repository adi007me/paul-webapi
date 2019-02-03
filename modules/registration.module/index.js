(function (registration) {
    var emailModule = require('../email.module');
    const uuidv4 = require('uuid/v4');
    const registrationData = require('../../data');

    let template = null;

    //TODO : is init called singleton ?
    function init() {
        var fs = require('fs');
        var filePath = __dirname + '/registration-template.html';
        
        fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
            if (!err) {
                template = data;
            } else {
                console.log(err);

                throw err;
            }
        });
    }

    function setUuid(userId, uuid, next) {
        registrationData.setUuid(userId, uuid, next);
    }

    function sendConfirmationEmail(email, next) {
        let basePath = process.env.baseUrl || 'http://localhost:3000';
        let uuid = uuidv4();

        basePath = basePath + '/confirm/' + uuid;

        template = template.replace('{{link}}', basePath);

        emailModule.send({
            to: email,
            subject: 'Welcome to Paul-Predictor',
            html: template
        }, function (err, response) {
            if (!err) {
                response.uuid = uuid;
            }

            next(err, response);
        });
    }

    function confirmRegistration(uuid, next) {
        registrationData.confirmRegistration(uuid, next);
    }

    registration.confirmRegistration = confirmRegistration;
    registration.sendConfirmationEmail = sendConfirmationEmail;
    registration.setUuid = setUuid;

    init();

    
})(module.exports);