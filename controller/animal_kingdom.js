var logger = require('../logic/log-util');

var express = require('express');
var router = express.Router();
var animal_kingdom = require('../model/animal_kingdom2');
var apiHelper = require('./apihelper')

router.get('/', function (req, res, next) {
    apiHelper.handleRequestNoData(req, res, next, animal_kingdom.getAll);
});

router.post('/', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, animal_kingdom.create, req.body, (result) => {
        req.body.id = result.insertId;
    return req.body;
});
});

router.put('/id/:id', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, animal_kingdom.update, req.body);
});

router.delete('/id/:id', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, animal_kingdom.delete, req.params.id, result => {});
});


module.exports = router;