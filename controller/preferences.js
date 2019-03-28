var logger = require('../logic/log-util');
logger.debug("Loading controller 'preferences'");

var express = require('express');
var router = express.Router();
var deepExtend = require('deep-extend');
var preferences = require('../model/preferences2');
// var defaultPreferences = require('../config/default_preferences');

router.get('/*', function (req, res, next) {
    req.getConnection(function (err, connection) {
        if (err)
            return next(err);

        preferences.get(connection)
            .then(function (result) {
                logger.debug("preferences.get() for GET-router '%s' result:",
                    req.path, result);
                // If no preferences are stored in the db, the default
                // preferences are returned. Otherwise, the stored preferences
                // are joined/merged with the default preferences. Because the
                // stored preferences prevail and because the entire pref-tree
                // is stored, this will normally result in just the stored
                // preferences. However, when during an upgrade new preferences
                // are added, they will fallback to the new defaults, as they
                // are not stored in the db yet.
                delete require.cache[
                    require.resolve('../config/default_preferences')];
                var defaultPreferences =
                    require('../config/default_preferences');
                logger.debug("preferences.get() for " +
                    "GET-router default-preferences:", defaultPreferences);
                var prefs = defaultPreferences;
                if (result[0] && result[0].value) {
                    logger.debug("preferences.get() for " +
                        "GET-router custom-preferences:", result[0].value);
                    prefs = deepExtend({}, defaultPreferences,
                        JSON.parse(result[0].value));
                    logger.debug("preferences.get() for " +
                        "GET-router merged-preferences:", prefs);
                }
                // If requested, return the specified sub-tree, otherwise
                // the entire pref-tree.
                req.path.split("/").some(function (key, index) {
                    key = key.trim();
                    if (key) {
                        if (prefs.hasOwnProperty('children') &&
                            prefs.children.hasOwnProperty(key)) {
                            prefs = prefs.children[key];
                        } else {
                            err = new Error("Resource not found: " +
                                req.path + ", " + key);
                            return true;
                        }
                    }
                });
                if (err)
                    return next(err);
                logger.debug("preferences.get() for GET-router '%s' prefs:",
                    req.path, prefs);
                res.json(prefs);
            })
            .catch(function (err) {
                logger.debug("preferences.get() for GET-router '%s' error:",
                    req.path, err);
                next(err);
            });
    });
});

// Only updating the entire pref-tree is supported (i.e. router.post('/',...),
// not separate branches or sub-trees (i.e. router.post('/*',...).
router.post('/', function (req, res, next) {
    var data = req.body;
    logger.debug("preferences.set() for POST-router '%s' data:",
        req.path, data);
    req.getConnection(function (err, connection) {
        if (err)
            return next(err);

        preferences.set(connection, data)
            .then(function (result) {
                logger.debug("preferences.set() for POST-router '%s' result:",
                    req.path, result);
                res.json(data);
            })
            .catch(function (err) {
                logger.debug("preferences.set() for POST-router '%s' error:",
                    req.path, err);
                next(err);
            });
    });
});

// Only deleting the entire pref-tree is supported (i.e. router.delete('/',...),
// not separate branches or sub-trees (i.e. router.delete('/*',...).
router.delete('/', function (req, res, next) {
    logger.debug("preferences.delete() for DELETE-router '%s'", req.path);
    req.getConnection(function (err, connection) {
        if (err)
            return next(err);

        preferences.delete(connection)
            .then(function (result) {
                logger.debug(
                    "preferences.delete() for DELETE-router '%s' result:",
                    req.path, result);
                res.json(result);
            })
            .catch(function (err) {
                logger.debug(
                    "preferences.delete() for DELETE-router '%s' error:",
                    req.path, err);
                next(err);
            });
    });
});

module.exports = router;
logger.silly("Loaded controller 'preferences'");
