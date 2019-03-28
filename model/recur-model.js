var logger = require('../logic/log-util');
var database = require('../logic/db-util2');

var recurModel = module.exports;

recurModel.getAll = function (db) {
    return database.sqlPromise(db, "SELECT * FROM recur_model");
};
