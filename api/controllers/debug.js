'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('Users');
const Item = mongoose.model('Items');

const logger = require('./logger');

/**
 * LIST ALL USERS 
 * Returns all users in the database
 */
exports.listallusers = function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      logger.ERROR('[LISTALLUSERS] ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    }
    res.json(users);
  });
};

/**
 * LIST ALL ITEMS 
 * Returns all 'tweets' in the database
 */
exports.listallitems = function(req, res) {
  Item.find({}, function(err, items) {
    if (err) {
      logger.ERROR('[LISTALLITEMS] ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    }
    res.json(items);
  });
};

/**
 * REMOVE ALL USERS 
 * Removes all users from database
 */
exports.removeallusers = function(req, res) {
  User.deleteMany({}, function(err, user) {
    if (err) {
      logger.ERROR('[REMOVEALLUSERS] ' + err);
      res.json({status: 'error'});
    } else {
      logger.INFO('[REMOVEALLUSERS] all users removed');
      res.json({status: 'OK'});
    }  
  });
};

/**
 * REMOVE ALL ITEMS 
 * Removes all 'tweets' from database
 */
exports.removeallitems = function(req, res) {
  Item.deleteMany({}, function(err, item) {
    if (err) {
      logger.ERROR('[REMOVEALLITEMS]: ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    }
    logger.INFO('[REMOVEALLITEMS] all items removed');
    res.json({status: 'OK'});
  });
};

/**
 * RESET 
 * Resets the database
 */
exports.reset = function(req, res) {
  var error = false;

  Item.deleteMany({}, function(err, item) {
    if (err) {
      logger.ERROR('[RESET]: ' + err);
      error = true;
    } else {
      logger.INFO('[RESET] all items removed');
    }
  });

  User.deleteMany({}, function(err, user) {
    if (err) {
      logger.ERROR('[RESET]: ' + err);
      error = true;
    } else {
      logger.INFO('[RESET] all users removed');
    }
  });

  if (error === true) {
    res.json({status: 'error', error: 'fatal'});
  } else {
    res.json({status: 'OK'});
  }
};