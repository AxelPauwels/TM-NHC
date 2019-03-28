const logger = require('../logic/log-util');

const database = require('../logic/db-util2');

const quarantaine = module.exports;

//to simplify the new model creations!
const theModelQuery = quarantaine;
const tableName = "quarantaine";

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

theModelQuery.getAllByHospitalizationId = function (db, id) {
    return database.sqlPromise(db,
        "SELECT * " +
        "FROM " + tableName +
        " WHERE ?", {hospitalization: id}
    );
};
//</editor-fold>

function build(data) {

    if (data.date === null) {
        data.date = database.dateString(data.date = new Date(Date.now()));
    }

    const fieldDefaults = [
        ['id', null],
        ['hospitalization', null],
        ['date', null],
        ['extra_info', null],
        ['quarantaine_action', null]
    ];

    const dateFixed = database.build(data, [], fieldDefaults);

    dateFixed.date =
        database.dateString(data.date = new Date(data.date));

    return dateFixed;
}

