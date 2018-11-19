const mongoose = require('mongoose');

const genreSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20
        }
    }
);

const Movie = mongoose.model('movie', mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 20
        },
        genre: {
            type: genreSchema
        },
        numberInStock: Number,
        dailyRentalRate: Number
    }
));

module.exports = Movie;