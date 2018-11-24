const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const {Genre} = require('../models/genre');

router.get('/:id', asyncMiddleware(getMovie));

router.get('/', asyncMiddleware(getMovies));

router.post('/', auth, asyncMiddleware(insertMovie, res));

router.put('/:id', auth, asyncMiddleware(updateMovie, res));

router.delete('/:id', [auth, admin], asyncMiddleware(removeMovie, res));

async function removeMovie(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) { return res.status(400).send('Invalid movie') };
  const result = await Movie.findByIdAndRemove(req.params.id);
  if (!result) { return res.status(404).send('The movie with the given ID was not found.')};
  return res.status(200).send(result);
}

async function getMovie(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) { return res.status(400).send('Invalid movie') };
  const movie = await Movie.findById(req.params.id);
  if (!movie) { return res.status(404).send('The movie with the given ID was not found.')};
  return res.status(200).send(movie);
}

async function getMovies(req, res) {
  const movie = await Movie
    .find()
    .sort({title: 1});
  return res.status(200).send(movie);
}

async function insertMovie(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.body.genre._id)) { return res.status(400).send('Invalid genre') };
  const genre = await Genre.findById(req.body.genre._id);
  if (!genre) return res.status(400).send('Invalid genre');
  let newMovie = new Movie({
    title: req.body.title,
    dailyRentalValue: req.body.dailyRentalValue,
    numberInStock: req.body.numberInStock,
    genre: {
      _id: genre._id,
      name: genre.name
    }
  });
  await newMovie.save();
  return res.status(200).send(newMovie);
}

async function updateMovie(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) { return res.status(400).send('Invalid movie') };
  const result = await Movie.findById(req.params.id);
  if (!result) { return res.status(404).send('The movie with the given ID was not found.') };
  for (var key in req.body) {
    result[key] = req.body[key];
  }
  await result.save();
  return res.status(200).send(result);
}

module.exports = router;