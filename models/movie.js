const mongoose = require('mongoose');
const { genreSchema } = require('./genre');
const Movie = mongoose.model('movie', mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 255
        },
        genre: {
            type: genreSchema,
            required: true
        },
        numberInStock: {
            type: Number,
            required: true,
            min: 0,
            max: 255
        },
        dailyRentalValue: {
            type: Number,
            required: true,
            min: 0,
            max: 255
        }
    }
));

module.exports = Movie;