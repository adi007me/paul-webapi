(function (homeController) {
    'use strict';

    var auth = require('../auth');
    
    homeController.init = function (app) {
        app.get('/', function (req, res) {
            res.render('index');
        });
    }

})(module.exports);