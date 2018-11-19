const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    }
});

const Genre = mongoose.model('genre', genreSchema);

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;