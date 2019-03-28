var logger = require('../logic/log-util');
logger.debug("Loading model 'animal'");

var database = require('../logic/db-util2');

var animal = module.exports;

animal.getAll = function (db) {
    return database.sqlPromise(db,
        "SELECT a.*, p.name AS prepare_category_name FROM animal a " +
        "LEFT OUTER JOIN prepare_category p ON a.food_prepare_category=p.id");
        // "SELECT * FROM animal");
};

animal.get = function (db, id) {
    return database.sqlPromise(db,
        "SELECT a.*, p.name AS prepare_category_name FROM animal a " +
        "LEFT OUTER JOIN prepare_category p ON a.food_prepare_category=p.id " +
        "WHERE ?", {id: id});
        // "SELECT * FROM animal WHERE ?", {id: id});
};

animal.create = function (db, data) {
    return database.sqlPromise(db,
        "INSERT INTO animal SET ?", build(data));
};

animal.update = function (db, data) {
    return database.sqlPromise(db,
        "UPDATE animal SET ? WHERE ?", [build(data), {id : data.id}]);
};

animal.delete = function (db, id) {
    return database.sqlPromise(db,
        "DELETE FROM animal WHERE ?", {id : id});
};

function build(data) {
    var fieldDefaults = [
        ['name', null],
        ['eats_at_night', 0],
        ['food_prepare_category', null],
        ['group_name', null],
        ['default_for_adoption', 0],
        ['ideal_weight_general_male', null],
        ['ideal_weight_female', null],
        ['image', null],
        ['scientific_name', null]
    ];
    return database.build(data, [], fieldDefaults);
}


//
//THOMAS MORE new methods!
animal.getSingle = function (db, id) {
    return database.sqlPromise(db,
        "SELECT * FROM animal WHERE id = " + id + ";"
    );
};
