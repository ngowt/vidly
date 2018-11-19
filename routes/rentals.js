const mongoose = require('mongoose');
const express = require('express');
const Customer = require('../models/customer');
const Movie = require('../models/movie');
const Rental = require('../models/rental');
const router = express.Router();

router.get('/:id', (req, res) => {
  getRental(req, res);
});

router.get('/', (req, res) => {
  getRentals(req, res);
});

router.post('/', (req, res) => {
  insertRental(req, res);
});

async function getRental(req, res) {
  try {
    const rental = await Rental.find({"_id": req.params.id});
    if (!rental) { return res.status(404).send('The rental with the given ID was not found.')};
    return res.status(200).send(rental);
  } catch (error) {
    return res.send(error);
  }
}

async function getRentals(req, res) {
  try {
    const rental = await Rental
      .find()
      .sort({dateOut: 1});
    return res.status(200).send(rental);
  } catch (error) {
    return res.send(error);
  }
}

async function insertRental(req, res) {
  try {
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
    
    movie.numberInStock--;
    
    await movie.save();
    await newRental.save();

    return res.status(200).send(newRental);
  } catch (error) {
    return res.send(error);
  }
}

module.exports = router;