const mongoose = require('mongoose');
const rentalSchema = new mongoose.Schema({
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
});
rentalSchema.methods.return = function() {
    this.dateReturned = Date.now();
    this.rentalFee = new Date(this.dateReturned - this.dateOut).getDate() * this.movie.dailyRentalValue;
}
rentalSchema.statics.lookup = function(customerId, movieId) {
    return this.findOne({
        'customer._id': customerId, 
        'movie._id': movieId
    });
}

const Rental = mongoose.model('rental', rentalSchema);
module.exports = Rental;