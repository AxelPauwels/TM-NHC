const logger = require('../logic/log-util');

const express = require('express');
const router = express.Router();
const taskv2 = require('../model/taskv2');
const apiHelper = require('./apihelper');


router.get('/', function (req, res, next) {
    apiHelper.handleRequestNoData(req, res, next, taskv2.getAll);
});

router.post('/', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, taskv2.create, req.body, (result) => {
        req.body.id = result.insertId;
        return req.body;
    });
});

router.put('/id/:id', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, taskv2.update, req.body);
});

router.delete('/id/:id', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, taskv2.delete, req.params.id, result => {});
});

router.patch('/id/:id', (req, res, next) => {
   apiHelper.handleRequest(req, res, next, taskv2.complete, req.body, result => result);
});


module.exports = router;