var logger = require('../logic/log-util');
logger.debug("Loading controller 'logger'");

var express = require('express');
var router = express.Router();
var util = require('util');

router.post('/', function (req, res, next) {
    var message =
        util.format.apply(util, req.body.messageArgs).replace(/\n\s+/g, ' ');
    logger[req.body.type]('[%s] %s (url: %s - headers: %j)',
        req.ip, message, req.body.url, req.headers);
    res.json(req.body);
});

module.exports = router;
logger.silly("Loaded controller 'logger'");
