(function (emailModule) {
    let gmailSend = require('gmail-send');

    const vcap_services = JSON.parse(process.env.VCAP_SERVICES || '{}');

    function send(request, next) {
        var gmailSender = gmailSend({
            user: vcap_services.emailId,
            pass: vcap_services.password,
            to: request.to,
            subject: request.subject,
            html: request.html
        });

        gmailSender({}, function (err, res) {
            if (!err) {
                next(null, {
                    status: "success",
                    response: res
                });
            } else {
                next(err);
            }
        });
    }

    emailModule.send = send;
    
})(module.exports);