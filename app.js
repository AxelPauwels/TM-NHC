require ('./logic/config-util');

var logger = require('./logic/log-util');
logger.info("App starting up...");

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
// var cookieParser = require('cookie-parser'); ARTE Since express-session 1.5.0, no longer needed
var bodyParser = require('body-parser');
var cors = require('cors');

var routes = require('./routes/index');
// var users = require('./routes/users'); ARTE not used
// var apiRoutes = require('./routes/api'); ARTE not used

var api2Routes = require('./routes/api-v2');

//Session Middle Ware
var session = require('express-session');

// TODO: ARTE should a proper session store be used like
// connect-mssql, express-mysql-session, mssql-session-store
// i.s.o a proprietary implementation

//mysql Settings
var mysql = require('mysql');
var myConnection = require('express-myconnection');
// var dbOptions = {
//     host: '127.0.0.1',
//     user: 'nhc',
//     password: 'nhc',
//     port: 3306,
//     database: 'nhc',
//     multipleStatements: true
// };

/* DB CONFIG OPTIONS MOVED TO .env FILE -> GOES INTO 'process.env.###' */
// var dbOptions = require('./config/db_options.json');


var dbOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_SCHEMA,
    multipleStatements: process.env.DB_MULTIPLE_STATEMENTS
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '256kb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '256kb'}));
//app.use(cookieParser()); ARTE Since express-session 1.5.0, no longer needed
app.use(express.static(__dirname + '/public'));
// session
app.use(session({
    name: "nhc_session",
    resave: false,
    secret: "nhc_session_tigre",
    saveUninitialized: true,
    cookie: {
        httpOnly: false,
        secure: true
    }
}));

//mySql
logger.debug("Set-up database connection:", dbOptions);
app.use(myConnection(mysql, dbOptions, 'single'));

app.use('/', routes);
// app.use('/users', users); ARTE not used
// app.use('/api', apiRoutes); ARTE not used
app.use('/api-v2', api2Routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
logger.debug("App initialized");
