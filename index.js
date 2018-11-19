const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const express = require('express');
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));