'use strict';

const logger = require('../logger');
const mongoose = require('mongoose'),
  Item = mongoose.model('Items');

/**
 * REMOVE ALL ITEMS 
 * Removes all 'tweets' from database
 */
module.exports = async function(req, res) {
  try {
    await Item.deleteMany({});
    logger.INFO('[REMOVEALLITEMS] all items removed');
    res.json({status: 'OK'});
  } catch (err) {
    logger.ERROR('[REMOVEALLITEMS] ' + err);
    res.json({status: 'error'});
  }
};
