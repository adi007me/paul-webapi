(function (controllers) {
    controllers.init = function (app) {
        var adminController = require('./adminController');
        var betInfoController = require('./betInfoController');        
        var choicesController = require('./choicesController');
        var homeController = require('./homeController');
        var leaderBoardController = require('./leaderBoardController');
        var leaguesController = require('./leagueController');
        var teamsController = require('./teamsController');
        var userController = require('./userController');
        const registrationController = require('./registrationController');
        const authenticationController = require('./authenticationController');        
                
        adminController.init(app);
        betInfoController.init(app);
        choicesController.init(app);
        homeController.init(app);
        leaderBoardController.init(app);
        leaguesController.init(app);
        teamsController.init(app);
        userController.init(app);
        registrationController.init(app);
        authenticationController.init(app);
    }
})(module.exports);