var database = require('../logic/db-util2');

var leftover = module.exports;

// TODO Make food-strings '%vis%' ... and history '365 DAY' configurable via settings
leftover.getAll = function (db) {
    return database.sqlPromise(db,
        // "SELECT DISTINCTROW l.*, c.name AS cage_name, " +
        // "DATEDIFF(CURDATE(), l.`day`) AS relative_day, r.color " +
        // "FROM cage c " +
        // "INNER JOIN route r ON (c.route = r.id) " +
        // "INNER JOIN hospitalization h ON (c.id = h.cage) " +
        // "INNER JOIN menu m ON (h.animal = m.animal) " +
        // "INNER JOIN food f ON (m.food = f.id) " +
        // "LEFT OUTER JOIN leftover l ON (l.cage = c.id) " +
        // "WHERE (f.`name` like '%kuiken%' " +
        // "OR f.`name` like '%sardien%' " +
        // "OR f.`name` like '%rietvoorn%' " +
        // "OR f.`name` like '%vis%') " +
        // "AND l.`day` BETWEEN CURDATE() - INTERVAL 365 DAY AND CURDATE() " +
        // "ORDER BY color, cage_name, cage, relative_day;"
        "SELECT DISTINCTROW " +
        "    l.*, " +
        "    c.name AS cage_name, " +
        "    c.route AS cage_route, " +
        "    DATEDIFF(CURDATE(), l.`day`) AS relative_day, " +
        "    r.color, " +
        "    ROUND(l.quantity / l.menu_quantity * 100) AS percent " +
        "FROM cage c " +
        "LEFT JOIN route r ON c.route = r.id " +
        "JOIN hospitalization_active  h ON c.id = h.cage " +
        "JOIN menu m ON h.animal = m.animal " +
        "JOIN food f ON m.food = f.id " +
        "LEFT JOIN leftover l ON l.cage = c.id " +
        "WHERE f.leftover_logging = 1 AND " +
        "    l.`day` BETWEEN CURDATE() - INTERVAL 365 DAY AND CURDATE() " +
        "ORDER BY cage_route, cage_name, relative_day;"
    );

};

// leftover.getForCage = function (db, cage) {
//     return database.sqlPromise(db,
//         "SELECT DISTINCTROW l.*, c.name AS cage_name, " +
//         "DATEDIFF(CURDATE(), l.`day`) AS relative_day " +
//         "FROM cage c " +
//         "INNER JOIN hospitalization h ON (c.id = h.cage) " +
//         "INNER JOIN menu m ON (h.animal = m.animal) " +
//         "INNER JOIN food f ON (m.food = f.id) " +
//         "LEFT OUTER JOIN leftover l ON (l.cage = c.id) " +
//         "WHERE (f.`name` like '%kuiken%' " +
//         "OR f.`name` like '%sardien%' " +
//         "OR f.`name` like '%rietvoorn%' " +
//         "OR f.`name` like '%vis%') " +
//         "AND (l.`day` BETWEEN CURDATE() - INTERVAL 365 DAY AND CURDATE()) " +
//         "AND (?) " +
//         "ORDER BY cage_name, cage, relative_day;",
//         {'l.cage': cage});
// };
//
leftover.getForCage = function (db, cage) {
    return database.sqlPromise(db,
        "SELECT DISTINCTROW " +
        "    l.*, " +
        "    c.name AS cage_name, " +
        "    c.route AS cage_route, " +
        "    DATEDIFF(CURDATE(), l.`day`) AS relative_day, " +
        "    r.color, " +
        "    ROUND(l.quantity / l.menu_quantity * 100) AS percent " +
        "FROM cage c " +
        "LEFT JOIN route r ON c.route = r.id " +
        "JOIN hospitalization_active  h ON c.id = h.cage " +
        "JOIN menu m ON h.animal = m.animal " +
        "JOIN food f ON m.food = f.id " +
        "LEFT JOIN leftover l ON l.cage = c.id " +
        "WHERE f.leftover_logging = 1 AND " +
        "    (l.`day` BETWEEN CURDATE() - INTERVAL 365 DAY AND CURDATE()) " +
        "    AND (?) " +
        "ORDER BY cage_route, cage_name, relative_day;",
        {'l.cage': cage});
};

leftover.save = function (db, data) {
    // Whether you choose to write if (value == null) or the explicit one
    // if (value === undefined || value === null)) is a matter of style and
    // in-house convention. But value == null does check that value is
    // null or undefined.
    if (data.quantity === 0 ||
        data.quantity === undefined ||
        data.quantity === null) {
        // Don't pollute the db with 0, undefined and null values,
        // so just remove the leftover in these cases.
        return database.sqlPromise(db,
            "DELETE FROM leftover " +
            "WHERE ? AND day = CURDATE();",
            [{cage: data.cage}]);
    } else {
        // If leftover does not exist, insert, else update
        return database.sqlPromise(db,
            "INSERT INTO leftover " +
            "    (cage, `day`, quantity, menu_quantity, animal_count) " +
            "    VALUES (?, CURDATE(), ?, ?, ?) " +
            "ON DUPLICATE KEY UPDATE " +
            "    quantity = ?, menu_quantity = ?, animal_count = ?;",
            [data.cage, data.quantity, data.menu_quantity, data.animal_count,
                data.quantity, data.menu_quantity, data.animal_count]);
    }
};