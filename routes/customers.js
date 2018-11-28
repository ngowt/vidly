const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const validateObjectId = require('../middleware/validateObjectId');
const Customer = require('../models/customer');

router.get('/:id', validateObjectId, asyncMiddleware(getCustomer));

router.get('/', asyncMiddleware(getCustomers));

router.post('/', asyncMiddleware(insertCustomer));

router.put('/:id', [auth, admin, validateObjectId], asyncMiddleware(updateCustomer));

router.delete('/:id', [auth, admin, validateObjectId], asyncMiddleware(removeCustomer));

async function removeCustomer(req, res) {
  const result = await Customer.findByIdAndRemove(req.params.id);
  if (!result) { return res.status(404).send('The customer with the given ID was not found.')};
  return res.status(200).send(result);
}

async function getCustomer(req, res) {
  const customer = await Customer.findById(req.params.id);
  if (!customer) { return res.status(404).send('The customer with the given ID was not found.')};
  return res.status(200).send(customer);
}

async function getCustomers(req, res) {
  const customer = await Customer
    .find()
    .sort({name: 1});
  return res.status(200).send(customer);
}

async function insertCustomer(req, res) {
  let newCustomer = new Customer(_.pick(req.body, ['name', 'isGold', 'phone']));
  await newCustomer.save();   
  return res.status(200).send(newCustomer);
}

async function updateCustomer(req, res) {
  const result = await Customer.findById(req.params.id);
  if (!result) { return res.status(404).send('The customer with the given ID was not found.') };
  for (var key in req.body) {
    result[key] = req.body[key];
  }
  await result.save();
  return res.status(200).send(result);
}

module.exports = router;