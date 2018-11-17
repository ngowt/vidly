const mongoose = require('mongoose');
const Genre = mongoose.model('genre', mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20
        }
    }
));

module.exports = Genre;