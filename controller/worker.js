const logger = require('../logic/log-util');

const express = require('express');
const router = express.Router();
const worker = require('../model/worker');
const apiHelper = require('./apihelper');

router.get('/', function (req, res, next) {
    apiHelper.handleRequestNoData(req, res, next, worker.getAll);
});

router.get('/date/:date', function(req, res, next) {
    apiHelper.handleRequest(req, res, next, worker.getAllByDate, req.params.date);
});

router.post('/', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, worker.create, req.body, (result) => {
        req.body.id = result.insertId;
        return req.body;
    });
});

router.put('/id/:id', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, worker.update, req.body);
});

router.delete('/id/:id', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, worker.delete, req.params.id, result => {});
});

router.patch('/id/:id', (req, res, next) => {
    apiHelper.handleRequest(req, res, next, worker.complete, req.body, result => result);
});




module.exports = router;