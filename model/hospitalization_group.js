const logger = require('../logic/log-util');

const database = require('../logic/db-util2');

const hospitalization_group = module.exports;

//to simplify the new model creations!
const theModelQuery = hospitalization_group;
const tableName = "hospitalization_group";

//<editor-fold desc="Basic CRUD">
theModelQuery.getAll = function (db) {
    return database.sqlPromise(db,
        "SELECT * " +
        "FROM " + tableName
    );
};

theModelQuery.get = function (db, id) {
    return database.sqlPromise(db,
        "SELECT * " +
        "FROM " + tableName +
        " WHERE id = " + id);
};

theModelQuery.create = function (db, data) {
    return database.sqlPromise(db,
        "INSERT INTO " +
        tableName +
        " SET ?", build(data));
};

theModelQuery.update = function (db, data) {
    return database.sqlPromise(db,
        "UPDATE " + tableName +
        " SET ? WHERE ?", [build(data), {id: data.id}]);
};

theModelQuery.delete = function (db, id) {
    return database.sqlPromise(db,
        "DELETE FROM  " + tableName + " WHERE ?", {id: id});
};
//</editor-fold>

function build(data) {
    const fieldDefaults = [
        ['id', null]
    ];
    return database.build(data, [], fieldDefaults);
}
