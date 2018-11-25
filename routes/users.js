const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/user');
const asyncMiddleware = require('../middleware/async');
const router = express.Router();

router.get('/', asyncMiddleware(getUsers));

router.get('/me', auth, asyncMiddleware(getUser));

router.post('/', asyncMiddleware(registerUser));

async function getUser(req, res) {
    const user = await User.findById(req.user._id).select({password: 0});
    if (!user) return res.status(400).send('Invalid user');
    return res.status(200).send(user);
}

async function getUsers(req, res) {
    let users = await User
        .find()
        .sort({name: 1})
        .select({"name": 1, "email": 1});
    return res.status(200).send(users);
}

async function registerUser(req, res) {
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
}

module.exports = router;