var database = require('../logic/db-util2');

var work = module.exports;

work.getAll = function (db) {
    var sql = "SELECT * FROM action";
    return database.sqlPromise(db, "SELECT * FROM action");
};

work.get = function (db, id) {
    return database.sqlPromise(db, "SELECT * FROM action WHERE ?", {id: id});
};

work.create = function (db, data) {
    return database.sqlPromise(db,
        "INSERT INTO action SET ?", buildAction(data));
};

work.update = function (db, data) {
    return database.sqlPromise(db,
        "UPDATE action SET ? WHERE ?", [buildAction(data), {id: data.id}]);
};

work.delete = function (db, id) {
    var sql = "DELETE FROM action WHERE id = " + id;
    return database.sqlPromise(db, "DELETE FROM action WHERE ?", {id: id});
};

function buildAction(data) {
    var optionalfields = ['description', 'protocol'];
    var mandatoryfields = [];
    return database.build(data, optionalfields, mandatoryfields);
}

