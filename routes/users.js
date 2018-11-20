const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.get('/', (req, res) => {
    getUsers(req, res);
});

router.post('/', (req, res) => {
    registerUser(req, res);
});

async function getUsers(req, res) {
    try {
        const users = await User
            .find()
            .sort({name: 1});
        return res.status(200).send(users);
    } catch (error) {
        return res.send(error);
    }
}

async function registerUser(req, res) {
  try {
    const results = await User.findOne({email: req.body.email});
    if (results) return res.status(409).send('The specified account already exists.');
    
    let newUser = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    });
    await newUser.save();

    return res.status(200).send(newUser);
  } catch (error) {
    return res.send(error);
  }
}

module.exports = router;