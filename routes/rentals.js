const mongoose = require('mongoose');
const express = require('express');
const Fawn = require('fawn');
const Customer = require('../models/customer');
const Movie = require('../models/movie');
const Rental = require('../models/rental');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

Fawn.init(mongoose);

router.get('/:id', validateObjectId, asyncMiddleware(getRental));

router.get('/', asyncMiddleware(getRentals));

router.post('/', auth, asyncMiddleware(insertRental));

async function getRental(req, res) {
  const rental = await Rental.findById(req.params.id);
  if (!rental) { return res.status(404).send('The rental with the given ID was not found.')};
  return res.status(200).send(rental);
}

async function getRentals(req, res) {
  const rental = await Rental
    .find()
    .sort({dateOut: 1});
  return res.status(200).send(rental);
}

async function insertRental(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.body.customer._id)) return res.status(400).send('Invalid customer');
  const customer = await Customer.findById(req.body.customer._id);
  if (!customer) return res.status(400).send('Customer not found');
  const movie = await Movie.findById(req.body.movie._id);
  if (!movie) return res.status(400).send('Movie not found');
  let newRental = new Rental({
    customer: {
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone
    },
    movie: {
      title: movie.title,
      dailyRentalValue: movie.dailyRentalValue
    }
  });
  try {
    new Fawn.Task()
    .save('rentals', newRental)
    .update('movies', { _id: movie._id }, {
      $inc: { numberInStock: -1 }
    })
    .run();
  } catch(er) {
    return res.send(er);
  }
  return res.status(200).send(newRental);
}

module.exports = router;