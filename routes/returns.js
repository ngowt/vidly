const mongoose = require('mongoose');
const express = require('express');
const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, asyncMiddleware(insertReturn));

async function insertReturn(req, res) {
    if (!req.body.customerId) return res.status(400).send('Invalid customerId');
    if (!req.body.movieId) return res.status(400).send('Invalid movieId');
    return res.status(200).send({
        customerId: req.body.customerId,
        movieId: req.body.movieId
    });
}

module.exports = router;