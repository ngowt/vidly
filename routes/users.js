const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = express.Router();

router.get('/', (req, res) => {
    getUsers(req, res);
});

router.get('/me', auth, (req, res) => {
    getUser(req, res);
})

router.post('/', (req, res) => {
    registerUser(req, res);
});

async function getUser(req, res) {
    try {
        const user = await User.findById(req.user._id).select({password: 0});
        if (!user) return res.status(400).send('Invalid user');
        return res.status(200).send(user);
    } catch(error) {
        res.send(error);
    }
}

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
    
    user = new User(_.pick(req.body, ['name', 'password', 'email', 'isAdmin']));
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.save();

    const token = user.generateAuthToken();
    return res
        .header('x-auth-token', token)    
        .status(200)
        .send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
  } catch (error) {
    return res.send(error);
  }
}

module.exports = router;