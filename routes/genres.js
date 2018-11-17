const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Genre = require('../models/genre');

router.get('/:id', (req, res) => {
  getGenre(req, res);
});

router.get('/', (req, res) => {
  getGenres(req, res);
});

router.post('/', (req, res) => {
  insertGenre(req, res);
});

router.put('/:id', (req, res) => {
  updateGenre(req, res);
});

router.delete('/:id', (req, res) => {
  removeGenre(req, res);
});

async function removeGenre(req, res) {
  try {
    const result = await Genre.findByIdAndRemove(req.params.id);
    if (!result) { return res.status(404).send('The genre with the given ID was not found.')};
    return res.status(200).send(`The ${result.name} genre was successfully deleted`);
  } catch (error) {
    return res.send(error);
  }
}

async function getGenre(req, res) {
  try {
    const genre = await Genre
      .find({"_id": req.params.id});
    if (!genre) { return res.status(404).send('The genre with the given ID was not found.')};
    return res.status(200).send(genre);
  } catch (error) {
    return res.send(error);
  }
}

async function getGenres(req, res) {
  try {
    const genres = await Genre
      .find()
      .sort({name: 1});
    return res.status(200).send(genres);
  } catch (error) {
    return res.send(error);
  }
}

async function insertGenre(req, res) {
  try {
    const genre = await Genre
      .find({"name": req.body.name});
  
    if (genre.length > 0) {
      return res.status(400).send('This genre already exists');
    }

    let newGenre = new Genre({
      name: req.body.name
    });
    
    await newGenre.save();
    return res.status(200).send(`${req.body.name} has been created as a new genre`);
  } catch (error) {
    return res.send(error);
  }
}

async function updateGenre(req, res) {
  try {
    const result = await Genre
      .findById(req.params.id);

    if (!result) { return res.status(404).send('The genre with the given ID was not found.') };

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