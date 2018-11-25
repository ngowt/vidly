const winston = require('winston');
const mongoose = require('mongoose');
const dbName = `vidly`;
const domain = `localhost`;
const port = `27017`;
const connectionString = `mongodb://${domain}:${port}/${dbName}`;

module.exports = function() {
    mongoose.connect(`${connectionString}`, {useNewUrlParser: true})
    .then( () => winston.info(`Connected to ${dbName} database...`));
}