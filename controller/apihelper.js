module.exports.handleRequest = function(req, res, next, func, funcData, funcResult) {
    req.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        func(connection, funcData)
            .then(function (result) {
                res.json(funcResult == undefined ? result : funcResult(result));
            })
            .catch(function (err) {
                next(err);
            });
    });
};

module.exports.handleRequestNoData = function(req, res, next, func, funcResult) {
    this.handleRequest(req, res, next, func, null, funcResult);
};
