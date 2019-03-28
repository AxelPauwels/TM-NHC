var logger = require('../logic/log-util');
logger.silly("Loading model 'menu'");

var database = require('../logic/db-util2');

var menu = module.exports;

menu.getAll = function (db) {
    // return database.sqlPromise(db, "SELECT * FROM menu");
    return database.sqlPromise(db,
        "SELECT a.name AS animal_name, f.name AS food_name, m.* " +
        "FROM menu m " +
        "LEFT JOIN animal a ON m.animal=a.id " +
        "LEFT JOIN food f ON m.food=f.id " +
        "ORDER BY a.name, f.name");
};

menu.get = function (db, id) {
    // return database.sqlPromise(db,
    //     "SELECT * FROM menu WHERE ?", {id: id});
    return database.sqlPromise(db,
        "SELECT a.name AS animal_name, f.name AS food_name, m.* " +
        "FROM menu m " +
        "LEFT JOIN animal a ON m.animal=a.id " +
        "LEFT JOIN food f ON m.food=f.id " +
        "HAVING ? " +
        "ORDER BY a.name, f.name", {id: id});
};

menu.getForAnimal = function (db, animal) {
    return database.sqlPromise(db,
        "SELECT * FROM menu WHERE ?", {animal: animal});
};

menu.fillCageContent = function (db, cage, board, userData) {
    return database.sqlExtendedPromise(db, userData,
        "SELECT * FROM group_menu " +
        "WHERE ? AND ? ORDER BY ?",
        [{cage: cage}, {board: board}, "order_column"]);
};

menu.getLeftoverLogging = function (db) {
    // TODO: Create pref. for fraction/ceiling e.g. round-up in steps: upto 2.5 round-up to .25, upto 5 round-up to .5, upto 100 round-up to 1, upwards round-up to 10
    return database.sqlPromise(db,
    "SELECT m.cage, occupancy.animal_count, " +
    "    CEILING(SUM(m.quantity)*2)/2 AS menu_quantity " +
    "FROM (SELECT c.id AS cage, SUM(h.quantity) AS animal_count " +
    "    FROM cage c " +
    "    JOIN hospitalization_active  h ON c.id = h.cage " +
    "    GROUP BY c.id) AS occupancy " +
    "JOIN group_menu m ON m.cage = occupancy.cage " +
    "JOIN food f ON f.id = m.food_id " +
    "WHERE f.leftover_logging = 1 " +
    "GROUP BY m.cage");
};

menu.create = function (db, data) {
    return database.sqlPromise(db, "INSERT INTO menu SET ?", build(data));
};

menu.update = function (db, data) {
    return database.sqlPromise(db,
        "UPDATE menu SET ? WHERE ?", [build(data), {id: data.id}]);
};

menu.delete = function (db, id) {
    return database.sqlPromise(db, "DELETE FROM menu WHERE ?", {id: id});
};

function build(data) {
    var fieldDefaults = [
        ['animal', null],
        ['food', null],
        ['quantity', null],
        ['each', null],
        ['board', null]
    ];
    return database.build(data, [], fieldDefaults);
}

logger.silly("Loaded model 'menu'");
