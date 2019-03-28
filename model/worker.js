var logger = require('../logic/log-util');
var database = require('../logic/db-util2');

var worker = module.exports;

worker.getAll = function(db){
    return database.sqlPromise(db, "SELECT * FROM worker");
};

worker.create = function(db, worker){
    return database.sqlPromise(db, "INSERT INTO worker SET ?", worker);
};

worker.update =  function (db, worker) {
    return database.sqlPromise(db, "INSERT INTO worker SET ? WHERE ?", [worker, {id: worker.id}]);
};

worker.delete = function (db, workerId) {
    return database.sqlPromise(db, "DELETE FROM worker WHERE ?", {id: workerId});
};

worker.getAllByDate = function(db, date){
    return database.sqlPromise(db, "SELECT * FROM `worker` WHERE `start_time` LIKE ?", '%' + date + '%');
};