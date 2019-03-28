var logger = require('../logic/log-util');
logger.debug("Loading controller 'taskexecutor'");

/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var taskExecutor = require('../model/taskexecutor2');

router.get('/', function(req, res, next) {
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		taskExecutor.getToday(connection)
			.then(function(result) {
                logger.debug("taskExecutor.getToday() for GET-router '/' result:", result);
				res.json(result);
			})
			.catch(function(err) {
				next(err);
			});
	});
});

router.get('/date/:date', function(req, res, next) {
	var date = req.params.date;
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		taskExecutor.getForDate(connection, date)
			.then(function(result) {
                logger.debug("taskExecutor.getForDate() for GET-router '/date/%s' result:", date, result);
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
		taskExecutor.create(connection, data)
			.then(function(result) {
				data.id = result.insertId;
                logger.debug("taskExecutor.create() for POST-router '/' result:", result);
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
		taskExecutor.update(connection, data)
			.then(function(result) {
                logger.debug("taskExecutor.update() for POST-router '/id/%s' result:", req.params.id, result);
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
		taskExecutor.delete(connection, id)
			.then(function(result) {
                logger.debug("taskExecutor.delete() for DELETE-router '/id/%S' result:", id, result);
				res.json({});
			})
			.catch(function(err) {
				next(err);
			});
	});
});

module.exports = router;
logger.silly("Loaded controller 'taskexecutor'");
