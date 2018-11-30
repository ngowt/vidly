const mongoose = require('mongoose');
const express = require('express');
const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, asyncMiddleware(insertReturn));

async function insertReturn(req, res) {
    return res.status(200).send();
}

module.exports = router;