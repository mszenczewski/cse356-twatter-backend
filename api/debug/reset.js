'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('Users');
const Item = mongoose.model('Items');

const logger = require('../logger');

/**
 * RESET 
 * Resets the database
 */
module.exports = function(req, res) {
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