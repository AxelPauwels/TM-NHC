var logger = require('../logic/log-util');

var express = require('express');
var router = express.Router();
var taskModel = require('../model/taskv2-model');
var apiHelper = require('./apihelper');


router.get('/configviewmodel', function (req, res, next) {
    apiHelper.handleRequestNoData(req, res, next, taskModel.getAllConfigViewModels);
});

router.post('/', (req, res, next) => apiHelper.handleRequest(req, res, next, taskModel.create, req.body));
router.put('/', (req, res, next) => apiHelper.handleRequest(req, res, next, taskModel.update, req.body));
router.delete('/:id', (req, res, next) => apiHelper.handleRequest(req, res, next, taskModel.delete, req.params.id));

module.exports = router;


