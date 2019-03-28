var logger = require('../logic/log-util');
logger.debug("Loading model 'measure'");

var database = require('../logic/db-util2');

var measure = module.exports;

measure.getAll = function (db) {
    return database.sqlPromise(db,
        "SELECT * FROM measure");
};

measure.get = function (db, id) {
    return database.sqlPromise(db,
        "SELECT * FROM measure WHERE ?", {id: id});
};

measure.create = function (db, data) {
    return database.sqlPromise(db,
        "INSERT INTO measure SET ?", build(data));
};

measure.update = function (db, data) {
    return database.sqlPromise(db,
        "UPDATE measure SET ? WHERE ?", [build(data), {id: data.id}]);
};

measure.delete = function (db, id) {
    return database.sqlPromise(db,
        "DELETE FROM measure WHERE ?", {id: id});
};

function build(data) {
    var fieldDefaults = [
        ['name', null],
        ['short_name', null]
    ];
    return database.build(data, [], fieldDefaults);
}
