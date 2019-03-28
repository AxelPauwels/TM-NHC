var logger = require('../logic/log-util');
logger.debug("Loading model 'food'");

var database = require('../logic/db-util2');

var food = module.exports;

food.getAll = function (db) {
    return database.sqlPromise(db,
        "SELECT * FROM food");
};

food.get = function (db, id) {
    return database.sqlPromise(db,
        "SELECT * FROM food WHERE ?", {id: id});
};

food.getDailyPrepare = function (db) {
    // return database.sqlPromise(db, "SELECT * FROM group_prepare_daily");
    // TODO: Create pref. for fraction/ceiling e.g. round-up in steps: upto 2.5 round-up to .25, upto 5 round-up to .5, upto 100 round-up to 1, upwards round-up to 10
    return database.sqlPromise(db,
        "SELECT " +
        "    f.name AS name, " +
        "    f.short_name AS short_name, " +
        "    f.feeding_measure AS feeding_measure, " +
        "    m.measure_name AS measure_name, " +
        "    m.short_measure_name AS short_measure_name, " +
        "    f.extra_quantity AS extra_quantity, " +
        "    SUM(CEILING(m.quantity*2)/2) AS quantity, " +
        "    COUNT(*) AS count " +
        "FROM " +
        "    food f " +
        "    JOIN group_menu m ON f.id = m.food_id " +
        "WHERE f.prepare = 1 " +
        "GROUP BY f.id " +
        "HAVING quantity > 0 OR extra_quantity > 0;");
};

food.getLeftoverLogging = function (db) {
    return database.sqlPromise(db,
        "SELECT * FROM food WHERE leftover_logging = 1");
};

food.create = function (db, data) {
    return database.sqlPromise(db,
        "INSERT INTO food SET ?", build(data));
};

food.update = function (db, data) {
    return database.sqlPromise(db,
        "UPDATE food SET ? WHERE ?", [build(data), {id: data.id}]);
};

food.delete = function (db, id) {
    return database.sqlPromise(db,
        "DELETE FROM food WHERE ?", {id: id});
};

function build(data) {
    var fieldDefaults = [
        ['name', null],
        ['feeding_measure', null],
        ['prepare', 0],
        ['extra_quantity', null],
        ['leftover_logging', 0],
        ['short_name', null]
    ];
    return database.build(data, [], fieldDefaults);
}

