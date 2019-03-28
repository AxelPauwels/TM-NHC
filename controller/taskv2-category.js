var logger = require('../logic/log-util');

var express = require('express');
var router = express.Router();
var taskCategory = require('../model/taskv2-category');
var apiHelper = require('./apihelper');

router.get('/', function (req, res, next) {
    apiHelper.handleRequestNoData(req, res, next, taskCategory.getAll);
});

router.get('/configviewmodel', function (req, res, next) {
    apiHelper.handleRequestNoData(req, res, next, taskCategory.getAllConfigViewModels);
});

router.get('/:id', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, taskCategory.get, req.params.id);
});

router.post('/', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, taskCategory.create, req.body, (result) => {
        req.body.id = result.insertId;
        return req.body;
    });
});

router.put('/:id', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, taskCategory.update, req.body);
});

router.patch('/:id', function (req, res, next) {
    let category = req.body;
    category.id = parseInt(req.params.id);
    apiHelper.handleRequest(req, res, next, taskCategory.update, category);
});

router.delete('/:id', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, taskCategory.delete, req.params.id, result => {});
});

module.exports = router;


