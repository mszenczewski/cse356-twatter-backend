'use strict';

const logger = require('../logger');
const rimraf = require('rimraf');
const mongoose = require('mongoose'),
  User = mongoose.model('Users'),
  Item = mongoose.model('Items'),
  Media = mongoose.model('Items');

/**
 * RESET 
 * Resets the database
 */
module.exports = async function(req, res) {
  try {
    await Item.deleteMany({});
    await User.deleteMany({});
    await Media.deleteMany({});
    logger.INFO('[RESET] database reset');

    rimraf.sync("./media");

    res.json({status: 'OK'});
  } catch (err) {
    logger.ERROR('[RESET]: ' + err);
    res.json({status: 'error', error: 'fatal'});
  }
};