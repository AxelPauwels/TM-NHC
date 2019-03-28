var logger = require('../logic/log-util');
logger.debug("Loading controller 'work'");

var express = require('express');
var router = express.Router();
var action = require('../model/work2');

router.get('/', function(req, res, next) {
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		// var response;
		action.getAll(connection)
			.then(function(result) {
				// response = result;
                logger.debug("Action()getAll() for GET-router '/' result:", result);
                res.json(result);
			})
			.catch(function(err) {
				next(err);
			// })
			// .done(function() {
             //    logger.debug("Action()getAll() for GET-router '/' result:", response);
			// 	res.json(response);
			});
	});
});

router.get('/id/:id', function(req, res, next) {
	var id = req.params.id;
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		action.get(connection, id)
			.then(function(result) {
                logger.debug("action.get() for GET-router '/id/%s' result:", id, result);
				res.json(result);
			})
			.catch(function(err) {
				next(err);
			});
	});
});

router.post('/', function(req, res, next) {
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		var data = req.body;
		action.create(connection, data)
			.then(function(result) {
				data.id = result.insertId;
                logger.debug("action.create() for POST-router '/' result:", result);
				res.json(data);
			})
			.catch(function(err) {
				next(err);
			});
	});
});

router.post('/id/:id', function(req, res, next) {
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		var data = req.body;
		action.update(connection, data)
			.then(function(result) {
                logger.debug("action.update() for POST-router '/id/%s' result:", req.params.id, result);
				res.json(data);
			})
			.catch(function(err) {
				next(err);
			});
	});
});

router.delete('/id/:id', function(req, res, next) {
	var id = req.params.id;
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		action.delete(connection, id)
			.then(function(result) {
                logger.debug("action.delete() for DELETE-router '/id/%s' result:", id, result);
				res.json({});
			})
			.catch(function(err) {
				next(err);
			});
	});
});

module.exports = router;
logger.silly("Loaded controller 'work'");
