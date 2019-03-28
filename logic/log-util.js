/**
 * Created by ARTE on 6/26/17.
 */
var winston = require('winston');
require('winston-logrotate');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: process.env.APP_CONSOLE_LOG_LEVEL,
            handleExceptions: true,
            humanReadableUnhandledException: true,
            timestamp: true,
            json: false,
            colorize: true
        }),
        new winston.transports.Rotate({
            level: 'debug',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            timestamp: true,
            json: false,
            colorize: false,
            // file: path.join(__dirname, '..', 'log', 'server.log'),
            file: '../log/server.log',
            size: '16m',
            keep: 5,
            compress: true
        // }),
        // new winston.transports.File({
        //     level: 'debug',
        //     handleExceptions: true,
        //     humanReadableUnhandledException: true,
        //     timestamp: true,
        //     json: false,
        //     // filename: path.join(__dirname, '..', 'fixtures', 'logs', 'testtailrollingfiles.log'),
        //     filename: '../log/server.log',
        //     maxsize: 16 * 1024 * 1024,
        //     maxFiles: 3
        })
    ],
    exitOnError: false
});
module.exports = logger;
logger.silly("Loaded log-util'");
