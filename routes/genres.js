const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const router = express.Router();
const {Genre} = require('../models/genre');

router.get('/:id', asyncMiddleware(getGenre));

router.get('/', asyncMiddleware(getGenres));

router.post('/', auth, asyncMiddleware(insertGenre));

router.put('/:id', auth, asyncMiddleware(updateGenre));

router.delete('/:id', [auth, admin], asyncMiddleware(removeGenre));

async function removeGenre(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('Invalid genre');
  const result = await Genre.findByIdAndRemove(req.params.id);
  if (!result) { return res.status(404).send('The genre with the given ID was not found.')};
  return res.status(200).send(result);
}

async function getGenre(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('Invalid genre');
  const genre = await Genre.findById(req.params.id);
  if (!genre) { return res.status(404).send('The genre with the given ID was not found.')};
  return res.status(200).send(genre);
}

async function getGenres(req, res) {
  const genres = await Genre
    .find()
    .sort({name: 1});   
  return res.status(200).send(genres);
}

async function insertGenre(req, res, next) {
  const genre = await Genre.findOne({name: req.body.name});
  if (genre) return res.status(400).send('This genre already exists');
  let newGenre = new Genre(_.pick(req.body, ['name']));
  await newGenre.save();
  return res.status(200).send(newGenre);
}

async function updateGenre(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('Invalid genre');
  const result = await Genre.findById(req.params.id);
  if (!result) { return res.status(404).send('The genre with the given ID was not found.') };
  for (var key in req.body) {
    result[key] = req.body[key];
  }
  await result.save();
  return res.status(200).send(result);
}

module.exports = router;