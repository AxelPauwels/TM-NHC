var logger = require('../logic/log-util');

var express = require('express');
var router = express.Router();
var recurModel = require('../model/recur-model');
var apiHelper = require('./apihelper');


router.get('/', function (req, res, next) {
    apiHelper.handleRequestNoData(req, res, next, recurModel.getAll);
});

module.exports = router;


