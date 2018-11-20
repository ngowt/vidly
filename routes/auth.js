const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

router.post('/', (req, res) => {
    authenticateUser(req, res);
});

async function authenticateUser(req, res) {
  try {
    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');
    
    let authResult = await bcrypt.compare(req.body.password, user.password);
    if (!authResult) return res.status(400).send('Invalid email or password');

    return res.status(200).send("Successfully authenticated!");
  } catch (error) {
    return res.send(error);
  }
}

module.exports = router;