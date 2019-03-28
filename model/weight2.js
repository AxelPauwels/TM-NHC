var logger = require('../logic/log-util');
var database = require('../logic/db-util2');

var weight = module.exports;

weight.getAll = function (db) {
    return database.sqlPromise(db,
        "SELECT * FROM weight");
};

weight.get = function (db, id) {
    return database.sqlPromise(db,
        "SELECT * FROM weight WHERE ?", {id: id});
};

weight.getForHospitalization = function (db, id) {
    return database.sqlPromise(db,
        "SELECT * FROM weight WHERE ?", {hospitalization: id});
};

weight.create = function (db, data) {
    return database.sqlPromise(db,
        "INSERT INTO weight SET ?", buildWeight(data));
};

weight.update = function (db, data) {
    var weight = buildWeight(data);
    return database.sqlPromise(db,
        "UPDATE weight SET ? WHERE ?", [weight, {id: weight.id}]);
};

weight.delete = function (db, id) {
    return database.sqlPromise(db,
        "DELETE FROM weight WHERE ?", {id: id});
};

function buildWeight(data) {
    logger.debug("buildWeight:", data);
    var weight = data;

    weight.date =
        data.date ? database.dateString(data.date) : null;

    logger.debug("weight:", weight);
    return weight;
}
