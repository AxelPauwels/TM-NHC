var logger = require('../logic/log-util');
logger.debug("Loading controller 'measure'");

var express = require('express');
var router = express.Router();
var measure = require('../model/measure2');

router.get('/', function(req, res, next) {
    req.getConnection(function(err, connection) {
        if (err) {
            logger.debug(
                "Get sql connection for GET-router '/' error:", err);
            return next(err);
        }
        measure.getAll(connection)
            .then(function(result) {
                logger.debug(
                    "measure.getAll() for GET-router '/' result:", result);
                res.json(result);
            })
            .catch(function(err) {
                logger.debug(
                    "measure.getAll() for GET-router '/' error:", err);
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
        measure.get(connection, id)
            .then(function (result) {
                logger.debug(
                    "measure.get() for GET-router '/id/%s' result:",
                    id, result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug(
                    "measure.get() for GET-router '/id/%s' error:", id, err);
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
        logger.debug("measure.create() for POST-router '/' data:", data);
        measure.create(connection, data)
            .then(function (result) {
                logger.debug(
                    "measure.create() for POST-router '/' result:", result);
                data.id = result.insertId;
                res.json(data);
            })
            .catch(function (err) {
                logger.debug(
                    "measure.create() for POST-router '/' error:", err);
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
        logger.debug(
            "measure.update() for POST-router '/id/%s' data:", id, data);
        measure.update(connection, data)
            .then(function (result) {
                logger.debug(
                    "measure.update() for POST-router '/id/%s' result:", id,
                    result);
                res.json(data);
            })
            .catch(function (err) {
                logger.debug(
                    "measure.update() for POST-router '/id/%s' error:",
                    id, err);
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
        measure.delete(connection, id)
            .then(function (result) {
                logger.debug(
                    "measure.delete() for DELETE-router '/id/%s' result:", id,
                    result);
                res.json({});
            })
            .catch(function (err) {
                logger.debug(
                    "measure.delete() for DELETE-router '/id/%s' error:", id,
                    err);
                next(err);
            });
    });
});

module.exports = router;
logger.silly("Loaded controller 'measure'");
