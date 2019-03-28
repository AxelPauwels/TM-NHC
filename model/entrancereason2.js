var logger = require('../logic/log-util');
var database = require('../logic/db-util2');

var entrance_reason = module.exports;

entrance_reason.getAll = function (db) {
    return database.sqlPromise(db,
        "SELECT * FROM entrance_reason");
};

entrance_reason.get = function (db, id) {
    return database.sqlPromise(db,
        "SELECT * FROM entrance_reason WHERE ?", {id: id});
};

entrance_reason.create = function (db, data) {
    return database.sqlPromise(db,
        "INSERT INTO entrance_reason SET ?", build(data));
};

entrance_reason.update = function (db, data) {
    return database.sqlPromise(db,
        "UPDATE entrance_reason SET ? WHERE ?",
        [build(data), {id: data.id}]);
};

entrance_reason.delete = function (db, id) {
    return database.sqlPromise(db,
        "DELETE FROM entrance_reason WHERE ?", {id: id});
};

function build(data) {
    var fieldDefaults = [['name', null],['standard', 0], ['use_allowed', 0]];
    return database.build(data, [], fieldDefaults);
}

