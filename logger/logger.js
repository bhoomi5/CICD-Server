const winston = require("winston");

var options = {
    file: {
        level: 'info',
        filename: `${__dirname}/log/fundoo.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, 
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        filename: `${__dirname}/log/fundoo.log`,
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

const logger = winston.createLogger({
    format: winston.format.combine(winston.format.simple(),winston.format.timestamp()),
    "transports": [
        new winston.transports.File(options.file),
        //  new winston.transports.File(options.console),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false,
});
module.exports=logger;