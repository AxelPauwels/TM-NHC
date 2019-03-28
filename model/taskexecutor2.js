var database = require('../logic/db-util2');

var taskExecutor = module.exports;
/**
 * TODO: Check why date is stored as integer (e.g. 20170703)
 * why not as date/date-string
 */
taskExecutor.getToday = function (db) {
    var todayDate = new Date();
    var today = todayDate.getFullYear() * 10000 +
        (todayDate.getMonth() + 1) * 100 +
        todayDate.getDate();
    return database.sqlPromise(db,
        "SELECT * FROM task_history " +
        "WHERE ?", {task_date: today});
};

taskExecutor.getForDate = function (db, date) {
    return database.sqlPromise(db,
        "SELECT * FROM task_history " +
        "WHERE ?", {task_date: date});
};

taskExecutor.create = function (db, data) {
    return database.sqlPromise(db,
        "INSERT INTO task_history SET ?", buildTask(data));
};

taskExecutor.update = function (db, data) {
    return database.sqlPromise(db,
        "UPDATE task_history SET ? WHERE ?", [buildTask(data), {id: data.id}]);
};

taskExecutor.delete = function (db, id) {
    return database.sqlPromise(db,
        "DELETE FROM task_history WHERE ?", {id: id});
};

function buildTask(data) {
    var optionalfields = ['task_code', 'task_date', 'task_executors'];
    var mandatoryfields = [];
    return database.build(data, optionalfields, mandatoryfields);
}

