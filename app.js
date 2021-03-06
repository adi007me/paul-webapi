'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

require('dotenv').config();


var controllers = require('./controllers');
var auth = require('./auth');

const authModule = require('./modules/auth-module');


var router = express.Router();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "vash");

app.use(function setHeaders(req, res, next) {    
    //TODO : Update Origin to allow only one host
    if (req.headers.origin) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }
    
    //https://paul-predictor.cfapps.io
    //res.setHeader('Access-Control-Allow-Origin', 'https://paul-predictor.cfapps.io');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.options("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.get("Origin") || "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //other headers here
    res.status(200).end();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//For Flash
//app.use(cookieParser('entrepreneur'));
//app.use(session({ cookie: { maxAge: 60000 } }));

app.use(authModule.setCurrentUser);

auth.init(app);
controllers.init(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function (err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}

//// production error handler
//// no stacktraces leaked to user
//app.use(function (err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
