var logger = require('../logic/log-util');
logger.debug("Loading controller 'cage'");

var express = require('express');
var router = express.Router();
var Q = require('q');
var cage = require('../model/cage2');
var hospitalization = require('../model/hospitalization2');
var menu = require('../model/menu2');

router.get('/', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug("Get sql connection for GET-router '/' error:", err);
            return next(err);
        }
        cage.getAll(connection)
            .then(function (result) {
                // response = result;
                logger.debug("cage.getAll() for GET-router '/' result:", result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug("cage.getAll() for GET-router '/' error:", err);
                next(err);
            });
    });
});

router.get('/id/:id', function (req, res, next) {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug("Get sql connection for GET-router '/id/%s' error:", id, err);
            return next(err);
        }
        cage.get(connection, id)
            .then(function (result) {
                logger.debug("cage.get() for GET-router '/id/%s' result", id, result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug("cage.get() for GET-router '/id/%s' error:", id, err);
                next(err);
            });
    });
});

router.get('/route/:id', function (req, res, next) {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug("Get sql connection for GET-router '/route/%s' error:", id, err);
            return next(err);
        }
        cage.getForRoute(connection, id)
            .then(function (result) {
                logger.debug("cage.getForRoute() for GET-router '/route/%s' result:", id, result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug("cage.getForRoute() for GET-router '/route/%s' error:", id, err);
                next(err);
            });
    });
});

router.post('/', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        var data = req.body;
        logger.debug("cage.create() for POST-router '/' data:", data);
        cage.create(connection, data)
            .then(function (result) {
                data.id = result.insertId;
                logger.debug("cage.create() for POST-router '/' result:", result);
                res.json(data);
            })
            .catch(function (err) {
                logger.debug("cage.create() for POST-router '/' error:", err);
                next(err);
            });
    });
});

router.post('/id/:id', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        var data = req.body;
        logger.debug("cage.update() for POST-router '/id/%s' data:", req.params.id, data);
        cage.update(connection, data)
            .then(function (result) {
                logger.debug("cage.update() for POST-router '/id/%s' result:", req.params.id, result);
                res.json(data);
            })
            .catch(function (err) {
                logger.debug("cage.update() for POST-router '/id/%s' error:", req.params.id, err);
                next(err);
            });
    });
});

router.delete('/id/:id', function (req, res, next) {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        cage.delete(connection, id)
            .then(function (result) {
                logger.debug("cage.delete() for DELETE-router '/id/%s' result:", id, result);
                res.json({});
            })
            .catch(function (err) {
                logger.debug("cage.delete() for DELETE-router '/id/%s' error:", id, err);
                next(err);
            });
    });
});

router.post('/switch/one/:one/two/:two', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        var one = req.params.one;
        var two = req.params.two;
        cage.switchContent(connection, one, two)
            .then(function (result) {
                logger.debug("cage.switchContent() for POST-router '/switch/one/%s/two/%s' result:", one, two, result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug("cage.switchContent() for POST-router '/switch/one/%s/two/%s' error:", one, two, err);
                next(err);
            });
    });
});

router.get('/leftover_logging', function(req, res, next) {
    req.getConnection(function(err, connection) {
        if (err) {
            return next(err);
        }
        cage.getLeftoverLogging(connection)
            .then(function(result) {
                logger.debug("cage.getLeftoverLogging() " +
                    "for GET-router '/leftover_logging' result:", result);
                res.json(result);
            })
            .catch(function(err) {
                logger.debug("cage.getLeftoverLogging() " +
                    "for GET-router '/leftover_logging' error:", err);
                next(err);
            });
    });
});

router.get('/leftover_logging/route/:route', function(req, res, next) {
    var route = req.params.route;
    req.getConnection(function(err, connection) {
        if (err) {
            return next(err);
        }
        cage.getLeftoverLoggingForRoute(connection, route)
            .then(function(result) {
                logger.debug("cage.getLeftoverLoggingForRoute() " +
                    "for GET-router '/leftover_logging/route/%s' result:",
                    route, result);
                res.json(result);
            })
            .catch(function(err) {
                logger.debug("cage.getLeftoverLoggingForRoute() " +
                    "for GET-router '/leftover_logging/route/%s' error:",
                    route, err);
                next(err);
            });
    });
});

router.get('/rich/route/:route/menu/:menu', function (req, res, next) {
    var route = req.params.route;
    var board = req.params.menu;
    req.getConnection(function (err, connection) {
        if (err) {
            logger.debug("Get sql connection for GET-router '/rich/route/%s/menu/%s' error:", route, board, err);
            return next(err);
        }
        var response;
        cage.getForRoute(connection, route)
            .then(function (cages) {
                logger.debug("Stage 1. cage.getForRoute() for GET-router '/rich/route/%s/menu/%s' result:", route, board, cages);
                response = cages;
                var qArray = [];
                cages.forEach(function (cage) {
                    qArray.push(hospitalization.fillCageContent(connection, cage.id, cage));
                });
                return Q.all(qArray);
            })
            .then(function (resultSet) {
                logger.debug("Stage 2. cage.getForRoute() for GET-router '/rich/route/%s/menu/%s' result:", route, board, resultSet);
                resultSet.forEach(function (resultItem) {
                    var lCage = resultItem.extendedData;
                    var lAnimals = resultItem.resultData;
                    lCage.animals1 = [];
                    lCage.animals2 = [];

                    if (lAnimals.length === 0) {
                        lCage.empty = true;
                        lCage.sectionCount = 0;
                    }
                    else {
                        lCage.empty = false;
                        lCage.sectionCount = 1;
                        lAnimals.forEach(function (lAnimal) {
                            if (!lCage.defaultSectionHash) {
                                lCage.defaultSectionHash = lAnimal.menu_hash;
                            }
                            if (lCage.defaultSectionHash === lAnimal.menu_hash) {
                                lCage.animals1.push(lAnimal);
                            }
                            else {
                                lCage.animals2.push(lAnimal);
                                lCage.sectionCount = 2;
                                lCage.wide = true;
                            }
                        });
                    }
                });
                var qArray = [];
                response.forEach(function (cage) {
                    qArray.push(menu.fillCageContent(connection, cage.id, board, cage));
                });
                return Q.all(qArray);
            })
            .then(function (resultSet) {
                logger.debug("Stage 3. cage.getForRoute() for GET-router '/rich/route/%s/menu/%s' result:", route, board, resultSet);
                resultSet.forEach(function (resultItem) {
                    var lCage = resultItem.extendedData;
                    var lMenus = resultItem.resultData;
                    lCage.menu1 = [];
                    lCage.menu2 = [];

                    lMenus.forEach(function (lMenu) {
                        // TODO: Create pref. for fraction/ceiling e.g. round-up in steps: upto 2.5 round-up to .25, upto 5 round-up to .5, upto 100 round-up to 1, upwards round-up to 10
                        lMenu.quantity = Math.ceil(lMenu.quantity * 2) / 2;
                        if (lCage.defaultSectionHash === lMenu.menu_hash) {
                            lCage.menu1.push(lMenu);
                        }
                        else {
                            lCage.menu2.push(lMenu);
                        }
                    });
                });
                var qArray = [];
                response.forEach(function (cage) {
                    qArray.push(hospitalization.getForCage(connection, cage.id, cage));
                });
                return Q.all(qArray);
            })
            .then(function (resultSet) {
                logger.debug("Stage 4. cage.getForRoute() for GET-router '/rich/route/%s/menu/%s' result:", route, board, resultSet);
                resultSet.forEach(function (resultItem) {
                    var lCage = resultItem.extendedData;
                    var lGuests = resultItem.resultData;
                    lCage.fiches = lGuests;
                    lCage.lateEater = false;
                    lCage.staffOnly = false;
                    lCage.dangerous = false;
                    lCage.warning = '';
                    lCage.medication = [];

                    lGuests.forEach(function (lGuest) {
                        if (lGuest.eats_at_night === 1) {
                            lCage.lateEater = true;
                        }
                        if (lGuest.staff_only === 1) {
                            lCage.staffOnly = true;
                        }
                        if (lGuest.dangerous === 1) {
                            lCage.dangerous = true;
                        }
                        if (lCage.warning === '' && lGuest.comment) {
                            lCage.warning = lGuest.comment;
                        }
                    });
                });
            // }) /* ARTE */
            // .then(function () {
                logger.debug("Final: cage.getForRoute() for GET-router '/rich/route/%s/menu/%s' result:", route, board, response);
                res.json(response);
            })
            .fail(function (err) {
                logger.error("cage.getForRoute() for GET-router '/rich/route/%s/menu/%s' error:", route, board, err);
                next(err);
            });
    });
});

router.get('/rich/preparecategory/:preparecategory/menu/:menu', function (req, res, next) {
    var preparecategory = req.params.preparecategory;
    var board = req.params.menu;
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        var response;
        cage.getForPrepareCategory(connection, preparecategory)
            .then(function (cages) {
                logger.debug("Stage 1. cage.getForPrepareCategory() for GET-router '/rich/preparecategory/%s/menu/%s' result:", preparecategory, board, cages);
                response = cages;
                var qArray = [];
                cages.forEach(function (cage) {
                    if (board === "1") cage.special_wide = true;
                    qArray.push(hospitalization.fillCageContent(connection, cage.id, cage));
                });
                return Q.all(qArray);
            })
            .then(function (resultSet) {
                logger.debug("Stage 2. cage.getForPrepareCategory() for GET-router '/rich/preparecategory/%s/menu/%s' result:", preparecategory, board, resultSet);
                resultSet.forEach(function (resultItem) {
                    var lCage = resultItem.extendedData;
                    var lAnimals = resultItem.resultData;
                    lCage.animals1 = [];
                    lCage.animals2 = [];

                    if (lAnimals.length === 0) {
                        lCage.empty = true;
                        lCage.sectionCount = 0;
                    }
                    else {
                        lCage.empty = false;
                        lCage.sectionCount = 1;
                        lAnimals.forEach(function (lAnimal) {
                            if (!lCage.defaultSectionHash) {
                                lCage.defaultSectionHash = lAnimal.menu_hash;
                            }
                            if (lCage.defaultSectionHash === lAnimal.menu_hash) {
                                lCage.animals1.push(lAnimal);
                            }
                            else {
                                lCage.animals2.push(lAnimal);
                                lCage.sectionCount = 2;
                                lCage.wide = true;
                            }
                        });
                    }
                });
                var qArray = [];
                response.forEach(function (cage) {
                    qArray.push(menu.fillCageContent(connection, cage.id, board, cage));
                });
                return Q.all(qArray);
            })
            .then(function (resultSet) {
                logger.debug("Stage 3. cage.getForPrepareCategory() for GET-router '/rich/preparecategory/%s/menu/%s' result:", preparecategory, board, resultSet);
                resultSet.forEach(function (resultItem) {
                    var lCage = resultItem.extendedData;
                    var lMenus = resultItem.resultData;
                    lCage.menu1 = [];
                    lCage.menu2 = [];

                    lMenus.forEach(function (lMenu) {
                        // TODO: Create pref. for fraction/ceiling e.g. round-up in steps: upto 2.5 round-up to .25, upto 5 round-up to .5, upto 100 round-up to 1, upwards round-up to 10
                        lMenu.quantity = Math.ceil(lMenu.quantity * 2) / 2;
                        if (lCage.defaultSectionHash === lMenu.menu_hash) {
                            lCage.menu1.push(lMenu);
                        }
                        else {
                            lCage.menu2.push(lMenu);
                        }
                    });
                });
                var qArray = [];
                response.forEach(function (cage) {
                    qArray.push(hospitalization.getForCage(connection, cage.id, cage));
                });
                return Q.all(qArray);
            })
            .then(function (resultSet) {
                logger.debug("Stage 4. cage.getForPrepareCategory() for GET-router '/rich/preparecategory/%s/menu/%s' result:", preparecategory, board, resultSet);
                resultSet.forEach(function (resultItem) {
                    var lCage = resultItem.extendedData;
                    var lGuests = resultItem.resultData;
                    lCage.fiches = lGuests;
                    lCage.lateEater = false;
                    lCage.staffOnly = false;
                    lCage.dangerous = false;
                    lCage.warning = '';
                    lCage.medication = [];

                    lGuests.forEach(function (lGuest) {
                        if (lGuest.eats_at_night === 1) {
                            lCage.lateEater = true;
                        }
                        if (lGuest.staff_only === 1) {
                            lCage.staffOnly = true;
                        }
                        if (lGuest.dangerous === 1) {
                            lCage.dangerous = true;
                        }
                        if (lCage.warning === '' && lGuest.comment) {
                            lCage.warning = lGuest.comment;
                        }
                    });
                });
            // }) /* ARTE */
            // .then(function () {
                logger.debug("Final: cage.getForPrepareCategory() for GET-router '/rich/preparecategory/%s/menu/%s' result:", preparecategory, board, resultSet);
                res.json(response);
            })
            .fail(function (err) {
                logger.error("cage.getForPrepareCategory() for GET-router '/rich/preparecategory/%s/menu/%s' error:", preparecategory, board, err);
                next(err);
            });
    });
});

router.get('/rich/medication/menu/:menu', function (req, res, next) {
    var board = req.params.menu;
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        var response;
        cage.getForMedication(connection)
            .then(function (cages) {
                logger.debug("Stage 1. cage.getForMedication() for GET-router '/rich/medication/menu/%s' result:", board, cages);
                response = cages;
                var qArray = [];
                cages.forEach(function (cage) {
                    qArray.push(hospitalization.fillCageContent(connection, cage.id, cage));
                });
                return Q.all(qArray);
            })
            .then(function (resultSet) {
                logger.debug("Stage 2. cage.getForMedication() for GET-router '/rich/medication/menu/%s' result:", board, resultSet);
                resultSet.forEach(function (resultItem) {
                    var lCage = resultItem.extendedData;
                    var lAnimals = resultItem.resultData;
                    lCage.animals1 = [];
                    lCage.animals2 = [];

                    if (lAnimals.length === 0) {
                        lCage.empty = true;
                        lCage.sectionCount = 0;
                    }
                    else {
                        lCage.empty = false;
                        lCage.sectionCount = 1;
                        lAnimals.forEach(function (lAnimal) {
                            lCage.animals1.push(lAnimal);
                        });
                    }
                });
                var qArray = [];
                response.forEach(function (cage) {
                    qArray.push(menu.fillCageContent(connection, cage.id, board, cage));
                });
                return Q.all(qArray);
            })
            .then(function (resultSet) {
                logger.debug("Stage 3. cage.getForMedication() for GET-router '/rich/medication/menu/%s' result:", board, resultSet);
                resultSet.forEach(function (resultItem) {
                    var lCage = resultItem.extendedData;
                    var lMenus = resultItem.resultData;
                    lCage.menu1 = [];
                    lCage.menu2 = [];

                    lMenus.forEach(function (lMenu) {
                        // TODO: Create pref. for fraction/ceiling e.g. round-up in steps: upto 2.5 round-up to .25, upto 5 round-up to .5, upto 100 round-up to 1, upwards round-up to 10
                        lMenu.quantity = Math.ceil(lMenu.quantity * 2) / 2;
                        lCage.menu1.push(lMenu);
                    });
                });
                var qArray = [];
                response.forEach(function (cage) {
                    qArray.push(hospitalization.getForCage(connection, cage.id, cage));
                });
                return Q.all(qArray);
            })
            .then(function (resultSet) {
                logger.debug("Stage 4. cage.getForMedication() for GET-router '/rich/medication/menu/%s' result:", board, resultSet);
                resultSet.forEach(function (resultItem) {
                    var lCage = resultItem.extendedData;
                    var lGuests = resultItem.resultData;
                    lCage.fiches = lGuests;
                    lCage.lateEater = false;
                    lCage.staffOnly = false;
                    lCage.dangerous = false;
                    lCage.warning = '';
                    lCage.medication = [];

                    lGuests.forEach(function (lGuest) {
                        if (lGuest.eats_at_night === 1) {
                            lCage.lateEater = true;
                        }
                        if (lGuest.staff_only === 1) {
                            lCage.staffOnly = true;
                        }
                        if (lGuest.dangerous === 1) {
                            lCage.dangerous = true;
                        }
                        if (lCage.warning === '' && lGuest.comment) {
                            lCage.warning = lGuest.comment;
                        }
                        if (lGuest.medication) {
                            lCage.medication.push(lGuest.medication);
                        }
                    });
                });
            // }) /* ARTE */
            // .then(function () {
                logger.debug("Final: cage.getForMedication() for GET-router '/rich/medication/menu/%s' result:", board, resultSet);
                res.json(response);
            })
            .fail(function (err) {
                logger.error("cage.getForMedication() for GET-router '/rich/medication/menu/%s' error:", board, err);
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
        cage.getSingle(connection, id)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });
});


module.exports = router;
// logger.silly("Loaded controller 'cage'");
