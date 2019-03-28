var logger = require('../logic/log-util');

var express = require('express');
var router = express.Router();
var theModel = require('../model/hedgehog_container');
var apiHelper = require('./apihelper');

router.get('/', function (req, res, next) {
    apiHelper.handleRequestNoData(req, res, next, theModel.getAll);
});

router.get('/withrelations/', function (req, res, next) {
    apiHelper.handleRequestNoData(req, res, next, theModel.getAllWithRelations);
});

//toegevoegd door raf
router.get('/occupiedcontainers/', function (req, res, next) {
    apiHelper.handleRequestNoData(req, res, next, theModel.getOccupiedContainers);
});

//toegevoegd door raf
router.get('/hedgehogsnotincontainer/', function (req, res, next) {
    apiHelper.handleRequestNoData(req, res, next, theModel.getHedgehogNotInContainer);
});

router.get('/id/:id', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, theModel.get, req.params.id);
});

//toegevoed door Raf
router.get('/withrelationsbycontainernumber/:number', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, theModel.getAllWithRelationsByContainerNumber, req.params.number);
});

router.get('/numberofcontainers', (req, res, next) => {
    apiHelper.handleRequest(req, res, next, theModel.getNumberOfContainers);
});

router.put('/numberofcontainers/:number', (req, res, next) => {
    req.getConnection(function (err, db) {
        if (err)
            return next(err);
        theModel.getNumberOfContainers(db).then(number => {
            if(req.params.number < 0){
                res.json({});
            } else if(req.params.number < number[0].total) {
                // Delete existing containers
                apiHelper.handleRequest(req, res, next, theModel.deleteContainers, req.params.number);
            } else if(req.params.number > number[0].total) {
                apiHelper.handleRequest(req, res, next, theModel.createContainers, {start: number[0].total+1, end: req.params.number});
            } else {
                res.json({});
            }
        });
    });
});



router.post('/', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, theModel.create, req.body, (result) => {
        req.body.id = result.insertId;
        return req.body;
    });
});

router.put('/id/:id', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, theModel.update, req.body);
});

router.delete('/id/:id', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, theModel.delete, req.params.id, result => {
    });
});

module.exports = router;
