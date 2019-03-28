var logger = require('../logic/log-util');
var database = require('../logic/db-util2');

var exit_reason = module.exports;

exit_reason.getAll = function (db) {
    return database.sqlPromise(db,
        "SELECT * FROM exit_reason");
};

exit_reason.get = function (db, id) {
    return database.sqlPromise(db,
        "SELECT * FROM exit_reason WHERE ?", {id: id});
};

exit_reason.create = function (db, data) {
    return database.sqlPromise(db,
        "INSERT INTO exit_reason SET ?", build(data));
};

exit_reason.update = function (db, data) {
    return database.sqlPromise(db,
        "UPDATE exit_reason SET ? WHERE ?",
        [build(data), {id: data.id}]);
};

exit_reason.delete = function (db, id) {
    return database.sqlPromise(db,
        "DELETE FROM exit_reason WHERE ?", {id: id});
};

function build(data) {
    var fieldDefaults = [['name', null],['standard', 0], ['use_allowed', 0]];
    return database.build(data, [], fieldDefaults);
}

