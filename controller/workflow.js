var logger = require('../logic/log-util');
logger.debug("Loading controller 'workflow'");

var express = require('express');
var router = express.Router();
var workflow = require('../model/workflow2');

router.get('/', function(req, res, next) {
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		// var response;
		workflow.getAll(connection)
			.then(function(result) {
				// response = result;
                logger.debug("WorkFlow()getAll() for GET-router '/' result:", result);
                res.json(result);
			})
			.catch(function(err) {
				next(err);
			// })
			// .done(function() {
             //    logger.debug("WorkFlow()getAll() for GET-router '/' result:", response);
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
		workflow.get(connection, id)
			.then(function(result) {
                logger.debug("workflow.get() for GET-router '/id/%s' result:", id, result);
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
		workflow.create(connection, data)
			.then(function(result) {
				data.id = result.insertId;
                logger.debug("workflow.create() for POST-router '/' result:", result);
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
		workflow.update(connection, data)
			.then(function(result) {
                logger.debug("workflow.update() for POST-router '/id/%s' result:", req.params.id, result);
				res.json(data);
			})
			.catch(function(err) {
				next(err);
			});
	});
});

module.exports = router;
logger.silly("Loaded controller 'workflow'");
