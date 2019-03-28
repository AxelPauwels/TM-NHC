var logger = require('../logic/log-util');

var express = require('express');
var router = express.Router();
var theModel = require('../model/hedgehog_container_division');
var apiHelper = require('./apihelper');

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

module.exports = router;
