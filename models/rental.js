const mongoose = require('mongoose');

const Rental = mongoose.model('rental', mongoose.Schema(
    {
        customer: {
            type: new mongoose.Schema({
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
            }),
        },
        movie: {
            type: new mongoose.Schema({
                title: {
                    type: String,
                    required: true,
                    trim: true,
                    minlength: 1,
                    maxlength: 255
                },
                dailyRentalValue: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 255
                }
            }),
            required: true
        },
        dateOut: {
            type: Date,
            required: true,
            default: Date.now
        },
        dateReturned: {
            type: Date
        },
        rentalFee: {
            type: Number,
            min: 0
        }
    }
));

module.exports = Rental;