var database = require('../logic/db-util2');

var workFlow = module.exports;

workFlow.getAll = function (db) {
    return database.sqlPromise(db,
        "SELECT h.*, a.description FROM action_history h " +
        "INNER JOIN action a ON h.action_id = a.id " +
        "WHERE status = 'NEW'");
};
workFlow.get = function (db, id) {
    return database.sqlPromise(db,
        "SELECT * FROM action_history WHERE ?", {id: id});
};

workFlow.create = function (db, data) {
    return database.sqlPromise(db,
        "INSERT INTO action_history SET ?", buildFlow(data));
};

workFlow.update = function (db, data) {
    return database.sqlPromise(db,
        "UPDATE action_history SET ? WHERE ?",
        [buildFlow(data), {id: data.id}]);
};

function buildFlow(data) {
    var optionalfields = ['action_id', 'more_info', 'status', 'executors'];
    var mandatoryfields = [];
    return database.build(data, optionalfields, mandatoryfields);
}

