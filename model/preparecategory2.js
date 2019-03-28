var logger = require('../logic/log-util');
logger.debug("Loading model 'preparecategory'");

var database = require('../logic/db-util2');

var preparecategory = module.exports;

preparecategory.getAll = function (db) {
    return database.sqlPromise(db,
        "SELECT * FROM prepare_category");
};

preparecategory.get = function (db, id) {
    return database.sqlPromise(db,
        "SELECT * FROM prepare_category WHERE ?", {id: id});
};

preparecategory.create = function (db, data) {
    return database.sqlPromise(db,
        "INSERT INTO prepare_category SET ?", build(data));
};

preparecategory.update = function (db, data) {
    return database.sqlPromise(db,
        "UPDATE prepare_category SET ? WHERE ?", [build(data), {id: data.id}]);
};

preparecategory.delete = function (db, id) {
    return database.sqlPromise(db,
        "DELETE FROM prepare_category WHERE ?", {id: id});
};

function build(data) {
    var fieldDefaults = [
        ['name', null]
    ];
    return database.build(data, [], fieldDefaults);
}
