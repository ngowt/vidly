const mongoose = require('mongoose');

const customersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20
    },
    isGold: Boolean,
    phone: String
});

module.exports = customersSchema;