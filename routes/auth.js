const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const asyncMiddleware = require('../middleware/async');
const router = express.Router();

router.post('/', asyncMiddleware(authenticateUser));

async function authenticateUser(req, res) {
    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');
    if (!req.body.password) return res.status(400).send("Invalid password");
    let authResult = await bcrypt.compare(req.body.password, user.password);
    if (!authResult) return res.status(400).send('Invalid email or password');
    const token = user.generateAuthToken();
    return res.status(200).send(token);
}

module.exports = router;