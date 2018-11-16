const mongoose = require('mongoose');

const customersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minLength: 1,
        maxlength: 20
    }
});

module.exports = customersSchema;