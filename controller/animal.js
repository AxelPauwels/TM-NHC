var logger = require('../logic/log-util');
logger.debug("Loading controller 'animal'");

/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var animal = require('../model/animal2');

router.get('/', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug("Get sql connection for GET-router '/' error:", err);
            return next(err);
        }
        animal.getAll(connection)
            .then(function (result) {
                logger.debug("animal.getAll() for GET-router '/' result:", result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug("animal.getAll() for GET-router '/' error:", err);
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
        animal.get(connection, id)
            .then(function (result) {
                logger.debug("animal.get() for GET-router '/id/%s' result:", id, result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug("animal.get() for GET-router '/id/%s' error:", id, err);
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
        logger.debug("animal.create() for POST-router '/' data:", data);
        animal.create(connection, data)
            .then(function (result) {
                logger.debug("animal.create() for POST-router '/' result:", result);
                data.id = result.insertId;
                res.json(data);
            })
            .catch(function (err) {
                logger.debug("animal.create() for POST-router '/' error:", err);
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
        logger.debug("animal.update() for POST-router '/id/:id' data:", data);
        animal.update(connection, data)
            .then(function (result) {
                logger.debug("animal.update() for POST-router '/id/:id' result:", result);
                res.json(data);
            })
            .catch(function (err) {
                logger.debug("animal.update() for POST-router '/id/:id' error:", err);
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
        animal.delete(connection, id)
            .then(function (result) {
                logger.debug("animal.delete() for DELETE-router '/id/%s' result:", id, result);
                res.json({});
            })
            .catch(function (err) {
                logger.debug("animal.delete() for DELETE-router '/id/%s' error:", id, err);
                next(err);
            });
    });
});


//
//THOMAS MORE new methods!
router.get('/idsingle/:id', function (req, res, next) {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        animal.getSingle(connection, id)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });
});


module.exports = router;
// logger.silly("Loaded controller 'animal'");