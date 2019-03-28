var config = require('dotenv').config({path: 'config/.env'}).parsed;

function isEmpty(value) { return value == undefined || value == ''};

var defaultConfig = {
    DB_HOST: '127.0.0.1',
    DB_USER: 'nhc',
    DB_PASS: 'nhc',
    DB_SCHEMA: 'nhc',
    DB_PORT: '3306',
    DB_MULTIPLE_STATEMENTS: 'true',

    APP_CONSOLE_LOG_LEVEL: 'debug',

    ROUTING_V2_HOST: '127.0.0.1',
    ROUTING_V2_PORT: '3000',
    ROUTING_V2_PATH: '',
    ROUTING_V3_HOST: '',
    ROUTING_V3_PORT: '',
    ROUTING_V3_PATH: ''
};

var keys = Object.keys(defaultConfig);
for(var i = 0;i<keys.length;i++)
{
    var key = keys[i];
    if(isEmpty(config[key])) // Use default
        process.env[key] = defaultConfig[key];

}

if(isEmpty(config.ROUTING_V3_HOST)) {
    process.env.ROUTING_V3_HOST = process.env.ROUTING_V2_HOST;
}
if(isEmpty(config.ROUTING_V3_PORT)) {
    process.env.ROUTING_V3_PORT = process.env.ROUTING_V2_PORT;
}
if(isEmpty(config.ROUTING_V3_PATH)) {
    process.env.ROUTING_V3_PATH = process.env.ROUTING_V2_PATH;
}

// Set PORT env so Node actually runs on that port
process.env.PORT = process.env.ROUTING_V2_PORT;