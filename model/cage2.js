var logger = require('../logic/log-util');
logger.silly("Loading model 'cage'");

var database = require('../logic/db-util2');

/*
 TODO: ARTE Static generic functions 'getAll' 'get' ... for all models
 i.s.o. separate objects, each with generic and specific functions
 NOTE: must be possible to extend and override (for specific functions)
 (base-class/prototype ???)

 e.g.
 The Cage object is only used to create a specific sqlPromise through one of
 its provided functions, after which the Cage object is destroyed again

 e.g.
 var cage = {
 getAll = function (db) {

 };
 get = function (db, id) {

 };
 }
 */

/*
 TODO: ARTE In order to avoid SQL Injection attacks, always escape any user provided data before using it inside a SQL query
 var sql = 'SELECT * FROM users WHERE id = ' + userId;
 var sql = 'SELECT * FROM users WHERE id = ' + connection.escape(userId);
 Escape with mysql.escape(), connection.escape() or pool.escape()
 Alternatively, you can use ? characters as placeholders for values you would like to have escaped
 connection.query('SELECT * FROM users WHERE id = ?', [userId], function (error, results, fields) {
 Multiple placeholders are mapped to values in the same order as passed
 connection.query('UPDATE users SET foo = ?, bar = ?, baz = ? WHERE id = ?', ['a', 'b', 'c', userId], function (error, results, fields) {
 escaping allows you to do neat things like
 var post  = {id: 1, title: 'Hello MySQL'};
 var query = connection.query('INSERT INTO posts SET ?', post, function (error, results, fields) {
 });
 console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'


 Preparing Queries
 =================
 You can use mysql.format to prepare a query with multiple insertion points, utilizing the proper escaping for ids and values. A simple example of this follows:

 var sql = "SELECT * FROM ?? WHERE ?? = ?";
 var inserts = ['users', 'id', userId];
 sql = mysql.format(sql, inserts);
 */

var cage = module.exports;

cage.getAll = function (db) {
    return database.sqlPromise(db,
        "SELECT c.*, r.name AS route_name, r.color " +
        "FROM cage c " +
        "LEFT JOIN route r ON c.route = r.id"
    );
};

cage.get = function (db, id) {
    return database.sqlPromise(db,
        "SELECT c.*, r.name AS route_name, r.color " +
        "FROM cage c " +
        "LEFT JOIN route r ON c.route = r.id " +
        "WHERE ?", {id: id});
};

cage.getLeftoverLogging = function (db) {
    return database.sqlPromise(db,
        "SELECT c.*, r.color " +
        "FROM cage c " +
        "LEFT JOIN route r ON c.route = r.id " +
        "JOIN hospitalization_active h ON c.id = h.cage AND c.id > 0 " +
        "JOIN menu m ON h.animal = m.animal " +
        "JOIN food f ON m.food = f.id AND f.leftover_logging = 1 " +
        "GROUP BY c.route, c.name"
    );
};

cage.getLeftoverLoggingForRoute = function (db, route) {
    return database.sqlPromise(db,
        "SELECT c.*, r.color " +
        "FROM cage c " +
        "LEFT JOIN route r ON c.route = r.id " +
        "JOIN hospitalization_active h ON c.id = h.cage AND c.id > 0 " +
        "JOIN menu m ON h.animal = m.animal " +
        "JOIN food f ON m.food = f.id AND f.leftover_logging = 1 " +
        "WHERE ? GROUP BY c.route, c.name",
        [{'c.route': route}]
    );
};

cage.getForRoute = function (db, route) {
    // return database.getOrdered(db, 'cage', {route: route}, 'board_position');
    return database.sqlPromise(db,
        "SELECT c.*, r.color " +
        "FROM cage c " +
        "JOIN route r ON c.route = r.id " +
        "WHERE ? ORDER BY ?",
        [{'c.route': route}, 'board_position']);
};

cage.getForPrepareCategory = function (db, preparecategory) {
    return database.sqlPromise(db,
        "SELECT DISTINCT c.*, r.color " +
        "FROM cage c " +
        "JOIN hospitalization_active h ON (c.id = h.cage AND c.id > 0) " +
        "JOIN animal a ON a.id = h.animal " +
        "LEFT JOIN route r ON r.id = c.route " +
        "WHERE ? ORDER BY c.route, c.board_position",
        {'a.food_prepare_category': preparecategory});
};

cage.getForMedication = function (db) {
    return database.sqlPromise(db,
        "SELECT DISTINCT c.*, r.color " +
        "FROM cage c " +
        "JOIN hospitalization_active h ON (c.id = h.cage AND c.id > 0) " +
        "LEFT JOIN route r ON c.route = r.id " +
        "WHERE NOT ISNULL(h.medication) AND h.medication <> '' " +
        "ORDER BY c.route, c.board_position");
};

cage.create = function (db, data) {
    return database.sqlPromise(db,
        "INSERT INTO cage SET ?", build(data));
};

cage.update = function (db, data) {
    return database.sqlPromise(db,
        "UPDATE cage SET ? WHERE ?", [build(data), {id: data.id}]);
};

cage.delete = function (db, id) {
    return database.sqlPromise(db,
        "DELETE FROM cage WHERE ?", {id: id});
};

cage.switchContent = function (db, one, two) {
    // return database.sqlPromise(db,
    //     "CALL swap_cage_content(?, ?);", [one, two]);

    return database.sqlPromise(db,
        "UPDATE hospitalization " +
        "SET cage = ( " +
        "    SELECT h2.cage2 FROM ( " +
        "        SELECT h1.id, IF(h1.cage=?, ?, ?) AS cage2 " +
        "        FROM hospitalization h1 " +
        "        WHERE h1.cage IN (?, ?) " +
        "    ) AS h2 " +
        "    WHERE h2.id = hospitalization.id) " +
        "WHERE cage IN (?, ?);", [one, two, one, one, two, one, two]);

    // TODO: Also swap the leftovers !!!
};

function build(data) {
    var fieldDefaults = [
        ['route', null],
        ['name', null],
        ['board_position', null],
        ['lights_on', 0],
        ['to_clean', 0]
    ];
    return database.build(data, [], fieldDefaults);
}

// logger.silly("Loaded model 'cage'");


//
//THOMAS MORE new methods!
cage.getSingle = function (db, id) {
    return database.sqlPromise(db,
        "SELECT * FROM cage WHERE id = " + id + ";"
    );
};