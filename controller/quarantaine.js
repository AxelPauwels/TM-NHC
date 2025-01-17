const logger = require('../logic/log-util');

const express = require('express');
const router = express.Router();

//to simplify the new controller creations!
const theModel = require('../model/quarantaine');
const apiHelper = require('./apihelper');

//<editor-fold desc="Basic CRUD">
router.get('/', function (req, res, next) {
    apiHelper.handleRequestNoData(req, res, next, theModel.getAll);
});

router.get('/id/:id', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, theModel.get, req.params.id);
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

router.get('/hospid/:id', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, theModel.getAllByHospitalizationId, req.params.id);
});
//</editor-fold>

module.exports = router;
