var logger = require('../logic/log-util');
logger.debug("Loading controller 'menu'");

var express = require('express');
var router = express.Router();
var menu = require('../model/menu2');

router.get('/', function(req, res, next) {
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		menu.getAll(connection)
			.then(function(result) {
                logger.debug("menu.getAll() for " +
					"GET-router '/' result:", result);
                res.json(result);
			})
			.catch(function(err) {
                logger.debug("menu.getAll() for " +
                    "GET-router '/' error:", err);
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
		menu.get(connection, id)
			.then(function(result) {
                logger.debug("menu.get() for " +
                    "GET-router '/id/%s' result:", id, result);
				res.json(result);
			})
			.catch(function(err) {
                logger.debug("menu.get() for " +
                    "GET-router '/id/%s' error:", id, err);
				next(err);
			});
	});
});

router.get('/animal/:animal', function(req, res, next) {
	var animal = req.params.animal;
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		menu.getForAnimal(connection, animal)
			.then(function(result) {
                logger.debug("menu.getForAnimal() for " +
                    "GET-router '/animal/%s' result:", animal, result);
				res.json(result);
			})
			.catch(function(err) {
                logger.debug("menu.getForAnimal() for " +
                    "GET-router '/animal/%s' error:", animal, err);
				next(err);
			});
	});
});

router.get('/leftover_logging', function(req, res, next) {
    req.getConnection(function(err, connection) {
        if (err) {
            return next(err);
        }
        menu.getLeftoverLogging(connection)
            .then(function(result) {
                logger.debug("menu.getLeftoverLogging() " +
                    "for GET-router '/leftover_logging' result:", result);
                res.json(result);
            })
            .catch(function(err) {
                logger.debug("menu.getLeftoverLogging() " +
                    "for GET-router '/leftover_logging' error:", err);
                next(err);
            });
    });
});

router.post('/', function(req, res, next) {
    var data = req.body;
    logger.debug("menu.create() for POST-router '/' data:", data);
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		menu.create(connection, data)
			.then(function(result) {
				data.id = result.insertId;
                logger.debug("menu.create() for " +
                    "POST-router '/' result:", result);
				res.json(data);
			})
			.catch(function(err) {
                logger.debug("menu.create() for " +
                    "POST-router '/' error:", err);
				next(err);
			});
	});
});

router.post('/id/:id', function(req, res, next) {
    var data = req.body;
    logger.debug("menu.update() for " +
        "POST-router '/id/%s' data:", req.params.id, data);
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		menu.update(connection, data)
			.then(function(result) {
                logger.debug("menu.update() for " +
                    "POST-router '/id/%s' result:", req.params.id, result);
				res.json(data);
			})
			.catch(function(err) {
                logger.debug("menu.update() for " +
                    "POST-router '/id/%s' error:", req.params.id, err);
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
		menu.delete(connection, id)
			.then(function(result) {
                logger.debug("menu.delete() for " +
                    "DELETE-router '/id/%s' result:", id, result);
				res.json({});
			})
			.catch(function(err) {
                logger.debug("menu.delete() for " +
                    "DELETE-router '/id/%s' error:", id, err);
				next(err);
			});
	});
});

module.exports = router;
logger.silly("Loaded controller 'menu'");
