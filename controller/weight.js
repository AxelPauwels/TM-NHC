var logger = require('../logic/log-util');
logger.debug("Loading controller 'weight'");

var express = require('express');
var router = express.Router();
var weight = require('../model/weight2');

router.get('/', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug("Get sql connection for GET-router '/' error:", err);
            return next(err);
        }
        weight.getAll(connection)
            .then(function (result) {
                logger.debug("weight.getAll() for GET-router '/' result:", result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug("weight.getAll() for GET-router '/' error:", err);
                next(err);
            });
    });
});

router.get('/id/:id', function (req, res, next) {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug("Get sql connection for GET-router '/id/%s' error:", id , err);
            return next(err);
        }
        weight.get(connection, id)
            .then(function (result) {
                logger.debug("weight.get() for GET-router '/id/%s' result:", id, result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug("weight.get() for GET-router '/id/%s' error:", id, err);
                next(err);
            });
    });
});

router.get('/hospitalization/:id', function (req, res, next) {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug("Get sql connection for GET-router '/hospitalization/%s' error:", id , err);
            return next(err);
        }
        weight.getForHospitalization(connection, id)
            .then(function (result) {
                logger.debug("weight.getForHospitalization() for GET-router '/hospitalization/%s' result:", id, result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug("weight.getForHospitalization() for GET-router '/hospitalization/%s' error:", id, err);
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
        logger.debug("weight.create() for POST-router '/' data:", data);
        weight.create(connection, data)
            .then(function (result) {
                logger.debug("weight.create() for POST-router '/' result:", result);
                data.id = result.insertId;
                res.json(data);
            })
            .catch(function (err) {
                logger.debug("weight.create() for POST-router '/' error:", err);
                next(err);
            });
    });
});

router.post('/id/:id', function (req, res, next) {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug("Get sql connection for POST-router '/id/%s' error:", id, err);
            return next(err);
        }
        var data = req.body;
        logger.debug("weight.update() for POST-router '/id/%s' data:", id, data);
        weight.update(connection, data)
            .then(function (result) {
                logger.debug("weight.update() for POST-router '/id/%s' result:", id, result);
                res.json(data);
            })
            .catch(function (err) {
                logger.debug("weight.update() for POST-router '/id/%s' error:", id, err);
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
        weight.delete(connection, id)
            .then(function (result) {
                logger.debug("weight.delete() for DELETE-router '/id/%s' result:", id, result);
                res.json({});
            })
            .catch(function (err) {
                logger.debug("weight.delete() for DELETE-router '/id/%s' error:", id, err);
                next(err);
            });
    });
});

module.exports = router;
logger.silly("Loaded controller 'weight'");
