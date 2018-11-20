const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
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
        let users = await User
            .find()
            .sort({name: 1})
            .select({"name": 1, "email": 1});
        return res.status(200).send(users);
    } catch (error) {
        return res.send(error);
    }
}

async function registerUser(req, res) {
  try {
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(409).send('The specified account already exists.');
    
    user = new User(_.pick(req.body, ['name', 'password', 'email']));
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.save();

    return res.status(200).send(_.pick(user, ['name', 'password', 'email']));
  } catch (error) {
    return res.send(error);
  }
}

module.exports = router;