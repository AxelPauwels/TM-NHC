var logger = require('../logic/log-util');
var database = require('../logic/db-util2');

var taskv2Model = module.exports;

taskv2Model.getAll = function (db) {
    return database.sqlPromise(db, "SELECT * FROM taskv2_model");
};

taskv2Model.getAllConfigViewModels = function (db) {
    return database.sqlPromise(db, "SELECT tm.id as id, tm.name as name, tm.taskv2_category as categoryId, tc.name as categoryName, tm.information as information, tm.recur_model as recurModel, rm.name as recurModelName, tm.recur_multiplier as recurMultiplier, tm.recur_day as recurDay, tm.recur_month as recurMonth FROM taskv2_model tm INNER JOIN taskv2_category tc ON tc.id=tm.taskv2_category INNER JOIN recur_model rm ON rm.id=tm.recur_model");
    //return database.sqlPromise(db, "SELECT tm.id as id, tm.name as name, tm.taskv2_category as categoryId, tc.name as categoryName, tm.information as information, tm.recur_model as recurModel, rm.name as recurModelName, tm.recur_multiplier as recurMultiplier, tm.recur_day as recurDay FROM taskv2_model tm INNER JOIN taskv2_category tc ON tc.id=tm.taskv2_category INNER JOIN recur_model rm ON rm.id=tm.recur_model");

};

taskv2Model.create = function (db, model) {
    return database.sqlPromise(db, "INSERT INTO taskv2_model SET ?", model);
};

taskv2Model.update = function (db, model) {
    return database.sqlPromise(db, "UPDATE taskv2_model SET ? WHERE ?", [model, {id: model.id}]);
};

taskv2Model.delete = function (db, modelId) {
    return database.sqlPromise(db, "DELETE FROM taskv2_model WHERE ?", {id: modelId});
};
