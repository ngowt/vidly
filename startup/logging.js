const winston = require('winston');
// require('winston-mongodb');

module.exports = function() {
    winston.handleExceptions(
        new winston.transports.Console({ 
            colorize: true, 
            prettyPrint: true
        }),
        new winston.transports.File({ filename: "./logs/UncaughtExceptions.log" }));

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    // winston.add(winston.transports.File({ filename: 'logfile.log' }));
    winston.add(winston.transports.File, { filename: "./logs/Logfile.log"});
    /*
    winston.add(winston.transports.MongoDB, {
        db: 'mongodb://localhost:27017/vidly',
        level: 'info'
    });
    */
}