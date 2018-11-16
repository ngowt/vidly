const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const genresSchema = require('../schemas/genres');

const Genre = mongoose.model('genre', genresSchema);

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
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

async function getGenre(req, res) {
  try {
    // Write logic to get list of genres from database
    const genre = await Genre
      .find({"_id": req.params.id});
    if (!genre) { return res.status(404).send('The genre with the given ID was not found.')};
    return res.status(200).send(genre);
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function getGenres(req, res) {
  try {
    // Write logic to get list of genres from database
    const genres = await Genre
      .find()
      .sort({name: 1});
    return res.status(200).send(genres);
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
}

async function updateGenre(req, res) {
  try {
    const genre = await Genre
      .findById(req.params.id);

    console.log(genre);
    if (!genre) res.status(404).send('The genre with the given ID was not found.'); 
    
    /*
    genre.name = req.body.name; 
    res.send(genre);
    */
  } catch (error) {
    console.log(error);
  }
}

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

module.exports = router;