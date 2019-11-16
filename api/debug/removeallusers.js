'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('Users');

const logger = require('../logger');

/**
 * REMOVE ALL USERS 
 * Removes all users from database
 */
module.exports = function(req, res) {
  User.deleteMany({}, function(err) {
    if (err) {
      logger.ERROR('[REMOVEALLUSERS] ' + err);
      res.json({status: 'error'});
    } else {
      logger.INFO('[REMOVEALLUSERS] all users removed');
      res.json({status: 'OK'});
    }  
  });
};