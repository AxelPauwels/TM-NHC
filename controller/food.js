var logger = require('../logic/log-util');
logger.debug("Loading controller 'food'");

var express = require('express');
var router = express.Router();
var food = require('../model/food2');

router.get('/', function(req, res, next) {
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		food.getAll(connection)
			.then(function(result) {
                logger.debug(
                	"food.getAll() for GET-router '/' result:", result);
                res.json(result);
			})
			.catch(function(err) {
                logger.error("food.getAll() for GET-router '/' error:", err);
				next(err);
			});
	});
});

router.get('/id/:id', function(req, res, next) {
	var id = req.params.id;
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		food.get(connection, id)
			.then(function(result) {
                logger.debug(
                    "food.get() for GET-router '/id/%s' result:", id, result);
				res.json(result);
			})
			.catch(function(err) {
                logger.debug(
                    "food.get() for GET-router '/id/%s' error:", id, err);
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
        logger.debug("food.create() for POST-router '/' data:", data);
		food.create(connection, data)
			.then(function(result) {
				data.id = result.insertId;
                logger.debug(
                    "food.create() for POST-router '/' result:", result);
				res.json(data);
			})
			.catch(function(err) {
                logger.debug(
                    "food.create() for POST-router '/' error:", err);
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
        logger.debug("food.update() for POST-router '/id/%s' data:",
            req.params.id, data);
		food.update(connection, data)
			.then(function(result) {
                logger.debug("food.update() for POST-router '/id/%s' result:",
                    req.params.id, result);
				res.json(data);
			})
			.catch(function(err) {
                logger.debug("food.update() for POST-router '/id/%s' error:",
                    req.params.id, err);
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
		food.delete(connection, id)
			.then(function(result) {
                logger.debug("food.delete() for DELETE-router '/id/%s' result:",
                    id, result);
				res.json({});
			})
			.catch(function(err) {
                logger.debug("food.delete() for DELETE-router '/id/%s' error:",
                    id, err);
				next(err);
			});
	});
});

router.get('/prepare/daily', function(req, res, next) {
    req.getConnection(function(err, connection) {
        if (err) {
            return next(err);
        }
        food.getDailyPrepare(connection)
            .then(function(result) {
                result = result.map(
                    function (item, index, arr) {
                        // TODO: Create pref. for fraction/ceiling e.g. round-up in steps: upto 2.5 round-up to .25, upto 5 round-up to .5, upto 100 round-up to 1, upwards round-up to 10
                        item.quantity = Math.ceil(item.quantity * 2) / 2;
                        return item;
                    }
                );
                logger.debug("food.getDailyPrepare() " +
                    "for GET-router '/prepare/daily' result:", result);
                res.json(result);
            })
            .catch(function(err) {
                logger.debug("food.getDailyPrepare() " +
                    "for GET-router '/prepare/daily' error:", err);
                next(err);
            });
    });
});

router.get('/leftover_logging', function(req, res, next) {
    req.getConnection(function(err, connection) {
        if (err) {
            return next(err);
        }
        food.getLeftoverLogging(connection)
            .then(function(result) {
                logger.debug("food.getLeftoverLogging() " +
                    "for GET-router '/leftover_logging' result:", result);
                res.json(result);
            })
            .catch(function(err) {
                logger.debug("food.getLeftoverLogging() " +
                    "for GET-router '/leftover_logging' error:", err);
                next(err);
            });
    });
});

module.exports = router;
logger.silly("Loaded controller 'food'");
