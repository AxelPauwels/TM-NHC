var database = require('../logic/db-util2');

var preferences = module.exports;

preferences.get = function (db) {
    return database.sqlPromise(db,
        "SELECT value FROM textblob WHERE ?", {name: 'preferences'});
};

preferences.set = function (db, data) {
    var value = JSON.stringify(data);
    // If preferences do not exist yet, insert, else update
    return database.sqlPromise(db,
        "INSERT INTO textblob (`name`, `value`) " +
        "VALUES ('preferences', ?) " +
        "ON DUPLICATE KEY UPDATE `value` = ?;",
        [value, value]);
};

preferences.delete = function (db) {
    return database.sqlPromise(db,
        "DELETE FROM textblob WHERE ?", {name: 'preferences'});
};

