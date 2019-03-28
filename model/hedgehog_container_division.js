var logger = require('../logic/log-util');

var database = require('../logic/db-util2');

var hedgehog_container_division = module.exports;

//to simplify the new model creations!
const theModelQuery = hedgehog_container_division;
const tableName = "hedgehog_container_division";

theModelQuery.getAll = function (db) {
    return database.sqlPromise(db,
        "SELECT * " +
        "FROM " + tableName
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
        ['name', null]
    ];
    return database.build(data, [], fieldDefaults);
}
