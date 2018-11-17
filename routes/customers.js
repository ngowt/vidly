const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
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

router.put('/:id', (req, res) => {
  updateCustomer(req, res);
});

router.delete('/:id', (req, res) => {
  removeCustomer(req, res);
});

async function removeCustomer(req, res) {
  try {
    const result = await Customer.findByIdAndRemove(req.params.id);
    if (!result) { return res.status(404).send('The customer with the given ID was not found.')};
    return res.status(200).send(result);
  } catch (error) {
    return res.send(error);
  }
}

async function getCustomer(req, res) {
  try {
    const customer = await Customer
      .find({"_id": req.params.id});
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
    let newCustomer = new Customer({
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    });
    
    await newCustomer.save();
    return res.status(200).send(newCustomer);
  } catch (error) {
    return res.send(error);
  }
}

async function updateCustomer(req, res) {
  try {
    const result = await Customer
      .findById(req.params.id);

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