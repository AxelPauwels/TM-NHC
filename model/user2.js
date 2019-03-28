var database = require('../logic/db-util2');

var user = module.exports;

user.getRolesForPin = function (db, pin) {
    return database.sqlPromise(db,
        "SELECT roles FROM security WHERE ?", {pin: pin});
};

