const mongoose = require('mongoose');
const express = require('express');
const config = require('config');
const winston = require('winston');
require('winston-mongodb');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');

winston.handleExceptions(
    new winston.transports.File({ filename: 'uncaughtExceptions.log'}));

process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
});

process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
});

winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, { 
    db: "mongodb://localhost/vidly",
    level: 'error'
});

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

const app = express();

const dbName = `vidly`;

mongoose.connect(`mongodb://localhost:27017/${dbName}`, {useNewUrlParser: true})
    .then( () => console.log(`Connected to ${dbName} database...`))
    .catch( err => console.error(`Could not connect to mongodb://localhost:27017/${dbName}...`, err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));