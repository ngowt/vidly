const mongoose = require('mongoose');

const User = mongoose.model('user', mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 255
        },
        password: {
            type: String,
            trim: true,
            required: true,
            minlength: 5,
            maxlength: 255
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            min: 1,
            max: 255
        }
    }
));

module.exports = User;