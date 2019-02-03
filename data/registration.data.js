(function (registrationData) {
    var database = require('./database');

    registrationData.init = function (data) {
        data.confirm = function (uuid, next) {
            database.getDb(function (err, db) {
                if (err) {
                    next(err);
                } else {
                    db.users.updateOne(
                        {
                            uuid: uuid
                        },
                        {
                            $set: { confirmed: true }
                        },
                        function (err, res) {
                            if (err) {
                                console.log('Error while marking confirmation' + uuid);
                                next(err);
                            } else {
                                console.log('Registration Confirmed', uuid);
                                next(null);
                            }
                        }
                    );
                }
            })
        };

        data.setUuid = (userId, uuid, next) => {
            database.getDb(function (err, db) {
                if (err) {
                    next(err);
                } else {
                    db.users.updateOne(
                        {
                            userId: userId
                        },
                        {
                            $set: { uuid: uuid}
                        },
                        function (err, res) {
                            if (err) {
                                console.log('Error setting UUID in Database - ' + uuid + ',' + userId);

                                next(err);
                            } else {
                                next(null);
                            }
                        }
                    );
                }
            })
        };

        data.confirmRegistration = (uuid, next) => {
            database.getDb(function (err, db) {
                if (err) {
                    next(err);
                } else {
                    db.users.updateOne(
                        {
                            uuid: uuid
                        },
                        {
                            $set: { verified: true}
                        },
                        function (err, res) {
                            if (err) {
                                console.log('Error Setting User Verified - ' + setUuid);

                                next(err);
                            } else {
                                next(null);
                            }
                        }
                    );
                }
            });
        };
    }
})(module.exports);