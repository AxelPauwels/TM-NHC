var logger = require('../logic/log-util');
var database = require('../logic/db-util2');

var taskv2 = module.exports;

taskv2.getAll = function (db) {
    return database.sqlPromise(db, "SELECT * FROM taskv2");
};

taskv2.getAllForDateWithModel = function (db, date) {
    date.setHours(0, 0, 0, 0);
    return database.sqlPromise(db, "SELECT * FROM taskv2 WHERE " +
        "(DATE(date_completed)=?) OR " +
        "(DATE(date_created)=? AND ((DATE(date_created)>= CURDATE() AND date_completed IS NULL)))" +
        " OR (?=CURDATE() AND ((DATE(date_created) < ? AND date_completed IS NULL)))"
        , [date, date, date, date, date]);
};

taskv2.create = function (db, task) {
    return database.sqlPromise(db, "INSERT INTO taskv2 SET ?", task);
};

taskv2.update = function (db, task) {
    return database.sqlPromise(db, "INSERT INTO taskv2 SET ? WHERE ?", [task, {id: task.id}]);
};

taskv2.delete = function (db, taskId) {
    return database.sqlPromise(db, "DELETE FROM taskv2 WHERE ?", {id: taskId});
};

taskv2.complete = function (db, task) {
    return database.sqlPromise(db, "UPDATE taskv2 SET ? WHERE ?", [{date_completed: new Date(task.date_completed), staff_name: task.staff_name}, {id: task.id}]);
};

taskv2.getLastTaskForModel = function(db, modelId) {
  return database.sqlPromise(db, "SELECT * FROM taskv2 WHERE taskv2_model=? ORDER BY date_created DESC LIMIT 1", modelId);
};
