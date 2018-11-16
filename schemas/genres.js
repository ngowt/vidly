const mongoose = require('mongoose');

const genresSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    }
});

module.exports = genresSchema;