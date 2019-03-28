const logger = require('../logic/log-util');

const database = require('../logic/db-util2');

const hedgehog_container = module.exports;

//to simplify the new model creations!
const theModelQuery = hedgehog_container;
const tableName = "hedgehog_container";

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

//toegevoegd door Raf
theModelQuery.getOccupiedContainers = function (db) {
    const query = "SELECT * FROM nhc.hedgehog_container hc where number in" +
        "(select distinct(hedgehog_container) from hospitalization_hedgehog_container)";
    return database.sqlPromise(db, query
    );
};

//toegevoegd door Raf
theModelQuery.getHedgehogNotInContainer = function (db) {
    const query = "SELECT h.* FROM hospitalization h INNER JOIN  animal a ON a.id=h.animal " +
        "left join hospitalization_hedgehog_container hhc on hhc.hospitalization = h.id " +
        "WHERE a.group_name='Egel' AND h.exit is NULL AND hhc.id is NULL";
    return database.sqlPromise(db, query
    );
};

//toegevoed door Raf
theModelQuery.getAllWithRelationsByContainerNumber = function (db, number) {
    const query = "SELECT *, h.id as hospitalization_hedgehog_container_id FROM " + tableName + " a    " +
        "LEFT OUTER JOIN hospitalization_hedgehog_container h    " +
        "ON a.id=h.hedgehog_container    " +
        "LEFT OUTER JOIN hedgehog_container_division d    " +
        "ON d.id=h.hedgehog_container_division where h.hedgehog_container = " + number;
    return database.sqlPromise(db, query
    );
};

theModelQuery.getNumberOfContainers = function(db) {
    const query = "SELECT COUNT(*) as total FROM " + tableName;
    return database.sqlPromise(db, query);
};

theModelQuery.createContainers = function(db, numbers) {
    let query = "";
    for(let i = numbers.start;i<=numbers.end;i++)
        query += "INSERT INTO " + tableName + " (number) VALUES(" + i + ");";
    return database.sqlPromise(db, query);
};

theModelQuery.deleteContainers = function(db, startNumber) {
  const query = "DELETE FROM " + tableName + " WHERE number > " + startNumber;
  return database.sqlPromise(db, query);
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
    console.log(data);
    const fieldDefaults = [
        ['id', null],
        ['number', null]
    ];
    return database.build(data, [], fieldDefaults);
}

