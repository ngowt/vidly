const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const Rental = require('../models/rental');
const Movie = require('../models/movie');
const router = express.Router();

router.post('/', [auth, validate(validateReturn)], asyncMiddleware(insertReturn));

async function insertReturn(req, res) {
    if (!req.body.customerId) return res.status(400).send('Invalid customerId');
    if (!req.body.movieId) return res.status(400).send('Invalid movieId');
    const result = await Rental.lookup(req.body.customerId, req.body.movieId);
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

function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };
    return Joi.validate(req, schema);
}

module.exports = router;

