'use strict';

const logger = require('../logger');
const mongoose = require('mongoose'),
  User = mongoose.model('Users');

/**
 * LIST ALL USERS 
 * Returns all users in the database
 */
module.exports = async function(req, res) {
  try {
    const results = await User.find({});
    res.json(results);
  } catch (err) {
    logger.ERROR('[LISTALLUSERS] ' + err);
    res.json({status: 'error'});
  }
};
