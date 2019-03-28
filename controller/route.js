var logger = require('../logic/log-util');
logger.debug("Loading controller 'route'");

var express = require('express');
var router = express.Router();
var route = require('../model/route2');

router.get('/', function(req, res, next) {
	req.getConnection(function(err, connection) {
		if (err) {
            logger.debug(
                "Get sql connection for GET-router '/' error:", err);
			return next(err); 
		}
		route.getAll(connection)
			.then(function(result) {
                logger.debug(
                    "route.getAll() for GET-router '/' result:", result);
                res.json(result);
			})
			.catch(function(err) {
                logger.debug(
                    "route.getAll() for GET-router '/' error:", err);
				next(err);
			});
	});
});

router.get('/id/:id', function (req, res, next) {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug(
                "Get sql connection for GET-router '/id/%s' error:", id , err);
            return next(err);
        }
        route.get(connection, id)
            .then(function (result) {
                logger.debug(
                    "route.get() for GET-router '/id/%s' result:", id, result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug(
                    "route.get() for GET-router '/id/%s' error:", id, err);
                next(err);
            });
    });
});

router.post('/', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug("Get sql connection for POST-router '/' error:", err);
            return next(err);
        }
        var data = req.body;
        logger.debug("route.create() for POST-router '/' data:", data);
        route.create(connection, data)
            .then(function (result) {
                logger.debug(
                    "route.create() for POST-router '/' result:", result);
                data.id = result.insertId;
                res.json(data);
            })
            .catch(function (err) {
                logger.debug("route.create() for POST-router '/' error:", err);
                next(err);
            });
    });
});

router.post('/id/:id', function (req, res, next) {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug(
                "Get sql connection for POST-router '/id/%s' error:", id, err);
            return next(err);
        }
        var data = req.body;
        logger.debug("route.update() for POST-router '/id/%s' data:", id, data);
        route.update(connection, data)
            .then(function (result) {
                logger.debug(
                    "route.update() for POST-router '/id/%s' result:", id,
                    result);
                res.json(data);
            })
            .catch(function (err) {
                logger.debug(
                    "route.update() for POST-router '/id/%s' error:", id, err);
                next(err);
            });
    });
});

router.delete('/id/:id', function (req, res, next) {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug(
                "Get sql connection for DELETE-router '/id/%s' error:", id,
                err);
            return next(err);
        }
        route.delete(connection, id)
            .then(function (result) {
                logger.debug(
                    "route.delete() for DELETE-router '/id/%s' result:", id,
                    result);
                res.json({});
            })
            .catch(function (err) {
                logger.debug(
                    "route.delete() for DELETE-router '/id/%s' error:", id,
                    err);
                next(err);
            });
    });
});

module.exports = router;
logger.silly("Loaded controller 'route'");
