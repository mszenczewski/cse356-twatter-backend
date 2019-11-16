'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('Users');

const logger = require('../logger');

/**
 * LIST ALL USERS 
 * Returns all users in the database
 */
module.exports = function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      logger.ERROR('[LISTALLUSERS] ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    }
    res.json(users);
  });
};
