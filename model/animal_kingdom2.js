var logger = require('../logic/log-util');
var database = require('../logic/db-util2');

var animal_kingdom = module.exports;

animal_kingdom.getAll = function (db) {
    return database.sqlPromise(db, "SELECT * FROM animal_kingdom");
};

animal_kingdom.create = function (db, task) {
    return database.sqlPromise(db, "INSERT INTO animal_kingdom SET ?", task);
};

animal_kingdom.update = function (db, task) {
    return database.sqlPromise(db, "INSERT INTO animal_kingdom SET ? WHERE ?", [task, {id: task.id}]);
};

animal_kingdom.delete = function (db, taskId) {
    return database.sqlPromise(db, "DELETE FROM animal_kingdom WHERE ?", {id: taskId});
};
