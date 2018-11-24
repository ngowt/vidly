const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const Customer = require('../models/customer');

router.get('/:id', (req, res) => {
  getCustomer(req, res);
});

router.get('/', (req, res) => {
  getCustomers(req, res);
});

router.post('/', (req, res) => {
  insertCustomer(req, res);
});

router.put('/:id', [auth, admin], (req, res) => {
  updateCustomer(req, res);
});

router.delete('/:id', [auth, admin], (req, res) => {
  removeCustomer(req, res);
});

async function removeCustomer(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { return res.status(400).send('Invalid customer') };

    const result = await Customer.findByIdAndRemove(req.params.id);
    if (!result) { return res.status(404).send('The customer with the given ID was not found.')};

    return res.status(200).send(result);
  } catch (error) {
    return res.send(error);
  }
}

async function getCustomer(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { return res.status(400).send('Invalid customer') };

    const customer = await Customer.findById(req.params.id);
    if (!customer) { return res.status(404).send('The customer with the given ID was not found.')};

    return res.status(200).send(customer);
  } catch (error) {
    return res.send(error);
  }
}

async function getCustomers(req, res) {
  try {
    const customer = await Customer
      .find()
      .sort({name: 1});
    return res.status(200).send(customer);
  } catch (error) {
    return res.send(error);
  }
}

async function insertCustomer(req, res) {
  try {
    let newCustomer = new Customer(_.pick(req.body, ['name', 'isGold', 'phone']));
    await newCustomer.save();
    
    return res.status(200).send(newCustomer);
  } catch (error) {
    return res.send(error);
  }
}

async function updateCustomer(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { return res.status(400).send('Invalid customer') };

    const result = await Customer.findById(req.params.id);
    if (!result) { return res.status(404).send('The customer with the given ID was not found.') };

    for (var key in req.body) {
      result[key] = req.body[key];
    }
    
    await result.save();
    return res.status(200).send(result);
  } catch (error) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send(error);
    }
  }
}

module.exports = router;