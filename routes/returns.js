const mongoose = require('mongoose');
const express = require('express');
const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const Rental = require('../models/rental');
const Movie = require('../models/movie');
const router = express.Router();

router.post('/', auth, asyncMiddleware(insertReturn));

async function insertReturn(req, res) {
    if (!req.body.customerId) return res.status(400).send('Invalid customerId');
    if (!req.body.movieId) return res.status(400).send('Invalid movieId');
    const result = await Rental.findOne({
        'customer._id': req.body.customerId, 
        'movie._id': req.body.movieId
    });
    if (!result) return res.status(404).send('Rental does not exist');
    if (result.dateReturned || result.rentalFee) return res.status(400).send('Rental has already been processed');
    result.dateReturned = Date.now();
    result.rentalFee = new Date(result.dateReturned - result.dateOut).getDate() * result.movie.dailyRentalValue;
    await result.save();

    await Movie.updateOne({ _id: result.movie._id }, {
        $inc: { numberInStock: 1 }
    });
    
    return res.status(200).send(result);
}

module.exports = router;