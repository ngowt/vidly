const mongoose = require('mongoose');
const Joi = require('joi');
const genres = require('./routes/genres');
const express = require('express');
const app = express();

const dbName = `vidly`;
const dbCollection = `genres`;

mongoose.connect(`mongodb://localhost:27017/${dbName}`, {useNewUrlParser: true})
    .then( () => console.log(`Connected to ${dbName} database...`))
    .catch( err => console.error(`Could not connect to mongodb://localhost:27017/${dbName}...`, err));

app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));