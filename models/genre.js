const Joi = require('joi');
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

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).max(20).required()
    };
    return Joi.validate(genre, schema);
}

module.exports.genreSchema = genreSchema;
module.exports.validateGenre = validateGenre;
module.exports.Genre = Genre;