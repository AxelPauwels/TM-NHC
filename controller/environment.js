const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.json({
        ROUTING_V3_HOST: process.env.ROUTING_V3_HOST,
        ROUTING_V3_PATH: process.env.ROUTING_V3_PATH,
        ROUTING_V3_PORT: process.env.ROUTING_V3_PORT
    });
});

module.exports = router;