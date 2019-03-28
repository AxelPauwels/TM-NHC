const logger = require('../logic/log-util');

const express = require('express');
const router = express.Router();

//to simplify the new controller creations!
const theModel = require('../model/quarantaine_action');
const apiHelper = require('./apihelper');

router.get('/', function (req, res, next) {
    apiHelper.handleRequestNoData(req, res, next, theModel.getAll);
});

router.post('/', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, theModel.create, req.body, (result) => {
        req.body.id = result.insertId;
        return req.body;
    });
});

router.put('/', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, theModel.update, req.body);
});

router.delete('/:id', function (req, res, next) {
    apiHelper.handleRequest(req, res, next, theModel.delete, req.params.id, result => {});
});

module.exports = router;
