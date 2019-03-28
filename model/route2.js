var logger = require('../logic/log-util');
logger.debug("Loading model 'route'");

var database = require('../logic/db-util2');

var route = module.exports;

route.getAll = function (db) {
    return database.sqlPromise(db,
        "SELECT * FROM route");
};

route.get = function (db, id) {
    return database.sqlPromise(db,
        "SELECT * FROM route WHERE ?", {id: id});
};

route.create = function (db, data) {
    return database.sqlPromise(db,
        "INSERT INTO route SET ?", build(data));
};

route.update = function (db, data) {
    return database.sqlPromise(db,
        "UPDATE route SET ? WHERE ?", [build(data), {id: data.id}]);
};

route.delete = function (db, id) {
    return database.sqlPromise(db,
        "DELETE FROM route WHERE ?", {id: id});
};

function build(data) {
    var fieldDefaults = [
        ['name', null],
        ['color', null]
    ];
    return database.build(data, [], fieldDefaults);
}

