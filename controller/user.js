var logger = require('../logic/log-util');
logger.debug("Loading controller 'user'");

var express = require('express');
var router = express.Router();
var user = require('../model/user2');

router.get('/pin/:pin', function(req, res, next) {
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		var pin = req.params.pin;
		new user.getRolesForPin(connection, pin)
			.then(function(result) {
                logger.debug("user.getRolesForPin() for GET-router '/pin/%s' result:", pin, result);
				res.json(result);
			})
			.catch(function(err) {
				next(err);
			})
		;
	});
});

module.exports = router;
logger.silly("Loaded controller 'user'");
