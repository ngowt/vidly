const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

router.get('/:id', (req, res) => {
  getMovie(req, res);
});

router.get('/', (req, res) => {
  getMovies(req, res);
});

router.post('/', (req, res) => {
  insertMovie(req, res);
});

router.put('/:id', (req, res) => {
  updateMovie(req, res);
});

router.delete('/:id', (req, res) => {
  removeMovie(req, res);
});

async function removeMovie(req, res) {
  try {
    const result = await Movie.findByIdAndRemove(req.params.id);
    if (!result) { return res.status(404).send('The movie with the given ID was not found.')};
    return res.status(200).send(result);
  } catch (error) {
    return res.send(error);
  }
}

async function getMovie(req, res) {
  try {
    const movie = await Movie
      .find({"_id": req.params.id});
    if (!movie) { return res.status(404).send('The movie with the given ID was not found.')};
    return res.status(200).send(movie);
  } catch (error) {
    return res.send(error);
  }
}

async function getMovies(req, res) {
  try {
    const movie = await Movie
      .find()
      .sort({title: 1});
    return res.status(200).send(movie);
  } catch (error) {
    return res.send(error);
  }
}

async function insertMovie(req, res) {
  try {
    let newMovie = new Movie({
      title: req.body.title,
      genre: {
        name: req.body.genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalValue: req.body.dailyRentalValue
    });
    
    await newMovie.save();
    return res.status(200).send(newMovie);
  } catch (error) {
    return res.send(error);
  }
}

async function updateMovie(req, res) {
  try {
    const result = await Movie
      .findById(req.params.id);

    if (!result) { return res.status(404).send('The movie with the given ID was not found.') };

    for (var key in req.body) {
      result[key] = req.body[key];
    }
    
    await result.save();
    return res.status(200).send(result);
  } catch (error) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send(error);
    }
  }
}

module.exports = router;