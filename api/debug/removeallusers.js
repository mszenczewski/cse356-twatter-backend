'use strict';

const logger = require('../logger');
const mongoose = require('mongoose'),
  User = mongoose.model('Users');

/**
 * REMOVE ALL USERS 
 * Removes all users from database
 */
module.exports = async function(req, res) {
  try {
    await User.deleteMany({});
    logger.INFO('[REMOVEALLUSERS] all users removed');
    res.json({status: 'OK'});
  } catch (err) {
    logger.ERROR('[REMOVEALLUSERS] ' + err);
    res.json({status: 'error'});
  }
};