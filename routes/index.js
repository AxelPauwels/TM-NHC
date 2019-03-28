var logger = require('../logic/log-util');
logger.debug("Loading router 'index'");

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('app_home', {title: 'NHC Wildlife Rescue & Shelter'});
});

/* GET home page. */
router.get('/wall', function (req, res, next) {
    res.render('app_home', {title: 'NHC Wildlife Rescue & Shelter'});
});

// /* Test JWT Token */
// router.post('/sq/user', function (req, res, next) {
//     // var jwt = require('jwt-simple');
//     // var hash = require('../config/private-key')();
//     var user = req.body;
//     // var encoded = jwt.encode(myObj, hash);
//     req.session.user = user;
//     logger.debug(JSON.stringify(req.session));
//     res.json(encoded);
// });
//
// router.get('/sq/user', function (req, res, next) {
//     logger.debug(JSON.stringify(req.session));
//     if (req.session.user) {
//         var user = req.session.user;
//         // var jwt = require('jwt-simple');
//         // var hash = require('../config/private-key')();
//         // var decoded = jwt.decode(token, hash);
//         res.json(user);
//     }
//     else {
//         res.json({});
//     }
// });
//
// router.get('/sq/set', function (req, res, next) {
//     logger.debug(JSON.stringify(req.session));
//     if (!req.session.user) {
//         // var jwt = require('jwt-simple');
//         // var hash = require('../config/private-key')();
//         var user = {name: "ben", pin: "1111"};
//         // var encoded = jwt.encode(myObj, hash);
//         req.session.user = user;
//         logger.debug(JSON.stringify(req.session));
//         res.json(user);
//     }
// });

module.exports = router;
logger.silly("Loaded router 'index'");
