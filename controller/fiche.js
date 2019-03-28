var logger = require('../logic/log-util');
logger.debug("Loading controller 'fiche'");

var express = require('express');
var router = express.Router();
var fiche = require('../model/hospitalization2');

const theModel = require('../model/hospitalization2');
const apiHelper = require('./apihelper');

router.get('/', function(req, res, next) {
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
        fiche.getAll(connection)
			.then(function(result) {
                logger.debug("fiche.getAll() for " +
					"GET-router '/' result:", result);
                res.json(result);
			})
			.catch(function(err) {
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
		fiche.get(connection, id)
			.then(function(result) {
                logger.debug("fiche.get() for " +
                    "GET-router '/id/%s' result:", id, result);
				res.json(result);
			})
			.catch(function(err) {
				next(err);
			});
	});
});

router.get('/uuid/:id', function(req, res, next) {
	var id = req.params.id;
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		fiche.getByUuid(connection, id)
			.then(function(result) {
                logger.debug("fiche.getByUuid() for " +
                    "GET-router '/uuid/%s' result:", id, result);
				res.json(result);
			})
			.catch(function(err) {
				next(err);
			});
	});
});

router.get('/state/:state', function(req, res, next) {
    var state = req.params.state;
    req.getConnection(function(err, connection) {
        if (err) {
            return next(err);
        }
        fiche.getByState(connection, state)
            .then(function(result) {
                logger.debug("fiche.getByState() for " +
                    "GET-router '/state/%s' result:", state, result);
                res.json(result);
            })
            .catch(function(err) {
                next(err);
            });
    });
});

router.get('/state/:state/uuid/:uuid', function(req, res, next) {
    var state = req.params.state;
    var uuid = req.params.uuid;
    req.getConnection(function(err, connection) {
        if (err) {
            return next(err);
        }
        fiche.getByStateUuid(connection, state, uuid)
            .then(function(result) {
                logger.debug("fiche.getByStateUuid() for " +
                    "GET-router '/state/%s/uuid/%s' result:",
                    state, uuid, result);
                res.json(result);
            })
            .catch(function(err) {
                next(err);
            });
    });
});

router.get('/adoption', function(req, res, next) {
	var state = req.params.state;
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		fiche.getForAdoption(connection)
			.then(function(result) {
                logger.debug("fiche.getForAdoption() for " +
                    "GET-router '/adoption' result:", result);
				res.json(result);
			})
			.catch(function(err) {
				next(err);
			});
	});
});

router.get('/overviewreport/start/:start/end/:end', function(req, res, next) {
    var start = new Date(parseInt(req.params.start));
    var end = new Date(parseInt(req.params.end));
    req.getConnection(function(err, connection) {
        if (err) {
            return next(err);
        }
        fiche.getOverviewReport(connection, start, end)
            .then(function(result) {
                logger.debug("fiche.getOverviewReport() for " +
                    "GET-router '/start/%s/end/%s' result:",
                    start, end, result);
                res.json(result);
            })
            .catch(function(err) {
                next(err);
            });
    });
});

router.post('/', function(req, res, next) {
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		var data = req.body;
		fiche.create(connection, data)
			.then(function(result) {
                // data.id = result.insertId;
                logger.debug("fiche.create() for " +
                    "POST-router '/' result:", result);
				res.json(data);
			})
			.catch(function(err) {
				next(err);
			});
	});
});

router.post('/id/:id', function(req, res, next) {
	req.getConnection(function(err, connection) {
		if (err) { 
			return next(err); 
		}
		var data = req.body;
		fiche.update(connection, data)
			.then(function(result) {
                logger.debug("fiche.update() for " +
                    "POST-router '/id/%s' result:", req.params.id, result);
				res.json(data);
			})
			.catch(function(err) {
				next(err);
			});
	});
});


//
//THOMAS MORE new methods!
router.get('/lastid/', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        fiche.getLastId(connection)
            .then(function (result) {
                res.json(result);
                //i could simply send the id to front end, but i didn't!
            })
            .catch(function (err) {
                next(err);
            });
    });
});

router.post('/idwithcontact/:id', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        var data = req.body;
        fiche.updateTheContact(connection, data)
            .then(function (result) {
                res.json(data);
            })
            .catch(function (err) {
                next(err);
            });
    });
});

router.get('/idsingle/:id', function (req, res, next) {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        fiche.getSingle(connection, id)
            .then(function (result) {
                logger.debug("fiche.get() for " +
                    "GET-router '/id/%s' result:", id, result);
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });
});

router.get('/getallcomplete/', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        fiche.getAllComplete(connection)
            .then(function (result){
              logger.debug("fiche.getForExcel() for " +
                "GET-router '/forexcel' result:", result);
              res.json(result);
            })
                //i could simply send the id to front end, but i didn't!
            .catch(function (err) {
                next(err);
              });
            });
    });
//Makes a controller to output database information for excel
router.get('/forexcel', function(req, res, next) {
    req.getConnection(function(err, connection) {
        if (err) {
            return next(err);
        }
        fiche.getForExcel(connection)
            .then(function (result) {
                logger.debug("fiche.getForExcel() for " +
                    "GET-router '/forexcel' result:", result);
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });
});

router.put('/id/:id/:updatemethod', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }

        const updatemethod = req.params.updatemethod;
        const data = req.body;

        if (updatemethod === "single") {
            apiHelper.handleRequest(req, res, next, theModel.update, req.body);

        } else if (updatemethod === "groep") {
            fiche.updateAllWhereGroupId(connection, data)
                .then(function (result) {
                    res.json(data);
                })
                .catch(function (err) {
                    next(err);
                });
        }
    });
});

router.put('/id/:id', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        apiHelper.handleRequest(req, res, next, theModel.update, req.body);
    });
});

//ONE TIME USE ONLY! A SECOND TIME USE WILL MAKE DUPLICATES!
router.get('/setTheHospitalizationGroups/:id', function (req, res, next) {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        fiche.setTheHospitalizationGroups(connection, id);
        // .then(function (result) {
        //     // logger.debug("fiche.get() for " +
        //     //     "GET-router '/id/%s' result:", id, result);
        //     res.json(result);
        // })
        // .catch(function (err) {
        //     next(err);
        // });
        res.json("It will take a few minutes to update the database! ");

    });
});

module.exports = router;
// logger.silly("Loaded controller 'fiche'");
