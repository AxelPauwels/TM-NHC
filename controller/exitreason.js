var logger = require('../logic/log-util');
logger.debug("Loading controller 'exitreason'");

/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var exitreason = require('../model/exitreason2');

router.get('/', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug("Get sql connection for GET-router '/' error:", err);
            return next(err);
        }
        exitreason.getAll(connection)
            .then(function (result) {
                logger.debug("exitreason.getAll() for GET-router '/' result:", result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug("exitreason.getAll() for GET-router '/' error:", err);
                next(err);
            });
    });
});

router.get('/id/:id', function (req, res, next) {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug("Get sql connection for GET-router '/id/%s' error:",id , err);
            return next(err);
        }
        exitreason.get(connection, id)
            .then(function (result) {
                logger.debug("exitreason.get() for GET-router '/id/%s' result:", id, result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug("exitreason.get() for GET-router '/id/%s' error:", id, err);
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
        logger.debug("exitreason.create() for POST-router '/' data:", data);
        exitreason.create(connection, data)
            .then(function (result) {
                logger.debug("exitreason.create() for POST-router '/' result:", result);
                data.id = result.insertId;
                res.json(data);
            })
            .catch(function (err) {
                logger.debug("exitreason.create() for POST-router '/' error:", err);
                next(err);
            });
    });
});

router.post('/id/:id', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug("Get sql connection for POST-router '/id/:id' error:", err);
            return next(err);
        }
        var data = req.body;
        logger.debug("exitreason.update() for POST-router '/id/:id' data:", data);
        exitreason.update(connection, data)
            .then(function (result) {
                logger.debug("exitreason.update() for POST-router '/id/:id' result:", result);
                res.json(data);
            })
            .catch(function (err) {
                logger.debug("exitreason.update() for POST-router '/id/:id' error:", err);
                next(err);
            });
    });
});

router.delete('/id/:id', function (req, res, next) {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug("Get sql connection for DELETE-router '/id/%s' error:", id, err);
            return next(err);
        }
        exitreason.delete(connection, id)
            .then(function (result) {
                logger.debug("exitreason.delete() for DELETE-router '/id/%s' result:", id, result);
                res.json({});
            })
            .catch(function (err) {
                logger.debug("exitreason.delete() for DELETE-router '/id/%s' error:", id, err);
                next(err);
            });
    });
});

module.exports = router;
logger.silly("Loaded controller 'exitreason'");
