var logger = require('../logic/log-util');
logger.debug("Loading controller 'leftover'");

var express = require('express');
var router = express.Router();
var leftover = require('../model/leftover2');

router.get('/', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        leftover.getAll(connection)
            .then(function (result) {
                logger.debug(
                    "leftover.getAll() for GET-router '/' result:", result);
                res.json(getCageLeftovers(result));
            })
            .catch(function (err) {
                logger.debug(
                    "leftover.getAll() for GET-router '/' error:", err);
                next(err);
            });
    });
});

router.get('/cage/:id', function (req, res, next) {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        var response;
        leftover.getForCage(connection, id)
            .then(function (result) {
                response = getCageLeftovers(result);
                logger.debug(
                    "leftover.getForCage() for GET-router '/cage/%s' result:",
                    id, response);
                res.json(response);
            })
            .catch(function (err) {
                logger.debug(
                    "leftover.getForCage() for GET-router '/cage/%s' error:",
                    id, err);
                next(err);
            });
    });
});

router.post('/', function (req, res, next) {
    req.getConnection(function (err, connection) {
        logger.debug("leftover.save() for POST-router '/' data:", req.body);
        if (err) {
            return next(err);
        }
        var data = req.body;
        leftover.save(connection, data)
            .then(function (result) {
                logger.debug(
                    "leftover.save() for POST-router '/' result:", result);
                res.json(data);
            })
            .catch(function (err) {
                logger.debug(
                    "leftover.save() for POST-router '/' error:", err);
                next(err);
            });
    });
});

function getCageLeftovers(leftovers) {
    // Construct an object of cageLeftovers objects
    var cageLeftovers = {};
    leftovers.forEach(function (cageDayLeftover) {
        if (!cageLeftovers[cageDayLeftover.cage_name]) {
            cageLeftovers[cageDayLeftover.cage_name] = {
                cage: cageDayLeftover.cage,
                cageName: cageDayLeftover.cage_name,
                cageRoute: cageDayLeftover.cage_route,
                color: cageDayLeftover.color,
                relative_day_leftover: {
                }
            };
        }
        cageLeftovers[cageDayLeftover.cage_name]
            .relative_day_leftover[cageDayLeftover.relative_day] = {
            quantity: cageDayLeftover.quantity,
            menu_quantity: cageDayLeftover.menu_quantity,
            animal_count: cageDayLeftover.animal_count,
            percent: cageDayLeftover.percent
        };
    });
    // Construct an array of cageLeftovers objects
    return Object.keys(cageLeftovers).map(function (key) {
        return cageLeftovers[key];
    });

}

module.exports = router;
logger.silly("Loaded controller 'leftover'");
