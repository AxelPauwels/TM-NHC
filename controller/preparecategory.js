var logger = require('../logic/log-util');
logger.debug("Loading controller 'preparecategory'");

var express = require('express');
var router = express.Router();
var preparecategory = require('../model/preparecategory2');

router.get('/', function(req, res, next) {
    req.getConnection(function(err, connection) {
        if (err) {
            logger.debug(
                "Get sql connection for GET-router '/' error:", err);
            return next(err);
        }
        preparecategory.getAll(connection)
            .then(function(result) {
                logger.debug(
                    "preparecategory.getAll() for GET-router '/' result:", result);
                res.json(result);
            })
            .catch(function(err) {
                logger.debug(
                    "preparecategory.getAll() for GET-router '/' error:", err);
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
        preparecategory.get(connection, id)
            .then(function (result) {
                logger.debug(
                    "preparecategory.get() for GET-router '/id/%s' result:",
                    id, result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug(
                    "preparecategory.get() for GET-router '/id/%s' error:", id, err);
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
        logger.debug("preparecategory.create() for POST-router '/' data:", data);
        preparecategory.create(connection, data)
            .then(function (result) {
                logger.debug(
                    "preparecategory.create() for POST-router '/' result:", result);
                data.id = result.insertId;
                res.json(data);
            })
            .catch(function (err) {
                logger.debug(
                    "preparecategory.create() for POST-router '/' error:", err);
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
            "preparecategory.update() for POST-router '/id/%s' data:", id, data);
        preparecategory.update(connection, data)
            .then(function (result) {
                logger.debug(
                    "preparecategory.update() for POST-router '/id/%s' result:", id,
                    result);
                res.json(data);
            })
            .catch(function (err) {
                logger.debug(
                    "preparecategory.update() for POST-router '/id/%s' error:",
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
        preparecategory.delete(connection, id)
            .then(function (result) {
                logger.debug(
                    "preparecategory.delete() for DELETE-router '/id/%s' result:", id,
                    result);
                res.json({});
            })
            .catch(function (err) {
                logger.debug(
                    "preparecategory.delete() for DELETE-router '/id/%s' error:", id,
                    err);
                next(err);
            });
    });
});

module.exports = router;
logger.silly("Loaded controller 'preparecategory'");
