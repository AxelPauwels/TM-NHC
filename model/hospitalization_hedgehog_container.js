var logger = require('../logic/log-util');

var database = require('../logic/db-util2');

var hospitalization_hedgehog_container = module.exports;

//to simplify the new model creations!
const theModelQuery = hospitalization_hedgehog_container;
const tableName = "hospitalization_hedgehog_container";

theModelQuery.getAll = function (db) {
    return database.sqlPromise(db,
        "SELECT * " +
        "FROM " + tableName +
        " ORDER BY hedgehog_container_division ASC"
        // "LEFT OUTER JOIN hospitalization_hedgehog_container h" +
        // "ON a.food_prepare_category=p.id"
    );
};

theModelQuery.getAllWithRelations = function (db) {
    const query = "SELECT * FROM " + tableName + " a    " +
        "LEFT OUTER JOIN hospitalization_hedgehog_container h    " +
        "ON a.id=h.hedgehog_container    " +
        "LEFT OUTER JOIN hedgehog_container_division d    " +
        "ON d.id=h.hedgehog_container_division";
    return database.sqlPromise(db, query
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

function build(data) {
    var fieldDefaults = [
        ['id', null],
        ['hospitalization', null],
        ['hedgehog_container_division', null],
        ['hedgehog_container', null]
    ];
    return database.build(data, [], fieldDefaults);
}
