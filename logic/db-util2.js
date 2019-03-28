var logger = require('../logic/log-util');
logger.debug("Loading 'db-utils'");

var Q = require('q');

/**
 * expose object
 */
var database = module.exports;
/**
 * 1. db.query(sqlString, callback)
 * connection.query('SELECT * FROM `books` WHERE `author` = "David"', function (error, results, fields) {
 *
 * 2. db.query(sqlString, values, callback)
 * connection.query('SELECT * FROM `books` WHERE `author` = ?', ['David'], function (error, results, fields) {
 *
 * 3. db.query(options, callback)
 * connection.query({
 *      sql: 'SELECT * FROM `books` WHERE `author` = ?',
 *      timeout: 40000, // 40s
 *      values: ['David']
 * }, function (error, results, fields) {
 *
 * 4. db.query(options, values, callback)
 * connection.query({
 *          sql: 'SELECT * FROM `books` WHERE `author` = ?',
 *          timeout: 40000, // 40s
 *      },
 *      ['David'],
 *      function (error, results, fields) {
 *          // error will be an Error if one occurred during the query
 *          // results will contain the results of the query
 *          // fields will contain information about the returned results fields (if any)
 *      }
 * );
 */
database.sqlPromise = function (db, sql, params) {
    logger.debug("sqlPromise:", db.format(sql, params));
    var defer = Q.defer();
    db.query(sql, params, function (err, result) {
        if (err) {
            logger.debug("sqlPromise error:", err);
            defer.reject(err);
        }
        else {
            logger.debug("sqlPromise result:", result);
            defer.resolve(result);
        }
    });
    return defer.promise;
};

database.sqlExtendedPromise = function (db, userData, sql, params) {
    logger.debug("sqlExtendedPromise:", db.format(sql, params), userData);
    var defer = Q.defer();
    db.query(sql, params, function (err, result) {
        if (err) {
            logger.debug("sqlExtendedPromise error:", err);
            defer.reject(err);
        }
        else {
            logger.debug("sqlExtendedPromise result:", result);
            defer.resolve({
                resultData: result,
                extendedData: userData
            });
        }
    });
    return defer.promise;
};

database.build = function (data, optionalfields, mandatoryfields) {
    logger.debug("build entity:", data, optionalfields, mandatoryfields);
    var entity = {};
    optionalfields.forEach(function (field) {
        if (data.hasOwnProperty(field))
            entity[field] = data[field];
    });
    mandatoryfields.forEach(function (fielddata) {
        entity[fielddata[0]] = data.hasOwnProperty(fielddata[0]) ? data[fielddata[0]] : fielddata[1];
    });
    logger.debug("entity:", entity);
    return entity;
};

// database.getAll = function (db, table) {
//     return database.sqlPromise(db,
//         "SELECT * FROM ??", [table]);
// };
//
// database.get = function (db, table, criteria) {
//     return database.sqlPromise(db,
//         "SELECT * FROM ?? WHERE ?", [table, criteria]);
// };
//
// database.getAllOrdered = function (db, table, fields) {
//     return database.sqlPromise(db,
//         "SELECT * FROM ?? ORDER BY ?", [table, fields]);
// };
//
// database.getOrdered = function (db, table, criteria, fields) {
//     return database.sqlPromise(db,
//         "SELECT * FROM ?? WHERE ? ORDER BY ?", [table, criteria, fields]);
// };

database.dateString = function (date) {
    var lDate = new Date(date);
    return lDate.getFullYear() + "-" + (lDate.getMonth() + 1) + "-" + lDate.getDate();
};

logger.silly("Loaded 'db-utils'");
