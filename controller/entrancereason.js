var logger = require('../logic/log-util');
logger.debug("Loading controller 'entrancereason'");

/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var entrancereason = require('../model/entrancereason2');

router.get('/', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug("Get sql connection for GET-router '/' error:", err);
            return next(err);
        }
        entrancereason.getAll(connection)
            .then(function (result) {
                logger.debug("entrancereason.getAll() for GET-router '/' result:", result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug("entrancereason.getAll() for GET-router '/' error:", err);
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
        entrancereason.get(connection, id)
            .then(function (result) {
                logger.debug("entrancereason.get() for GET-router '/id/%s' result:", id, result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug("entrancereason.get() for GET-router '/id/%s' error:", id, err);
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
        logger.debug("entrancereason.create() for POST-router '/' data:", data);
        entrancereason.create(connection, data)
            .then(function (result) {
                logger.debug("entrancereason.create() for POST-router '/' result:", result);
                data.id = result.insertId;
                res.json(data);
            })
            .catch(function (err) {
                logger.debug("entrancereason.create() for POST-router '/' error:", err);
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
        logger.debug("entrancereason.update() for POST-router '/id/:id' data:", data);
        entrancereason.update(connection, data)
            .then(function (result) {
                logger.debug("entrancereason.update() for POST-router '/id/:id' result:", result);
                res.json(data);
            })
            .catch(function (err) {
                logger.debug("entrancereason.update() for POST-router '/id/:id' error:", err);
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
        entrancereason.delete(connection, id)
            .then(function (result) {
                logger.debug("entrancereason.delete() for DELETE-router '/id/%s' result:", id, result);
                res.json({});
            })
            .catch(function (err) {
                logger.debug("entrancereason.delete() for DELETE-router '/id/%s' error:", id, err);
                next(err);
            });
    });
});

module.exports = router;
logger.silly("Loaded controller 'entrancereason'");
