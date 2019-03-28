// Based on npm nocache and npm node-nocache
var logger = require('../logic/log-util');
logger.debug("Loading router 'nocache'");

module.exports = function nocache(req, res, next) {
    logger.debug('Router nocache: %s %s %s %s (mounted as %s)',
        req.protocol, req.method, req.get('host'), req.originalUrl, req.url);
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};
