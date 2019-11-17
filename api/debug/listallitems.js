'use strict';

const logger = require('../logger');
const mongoose = require('mongoose'),
  Item = mongoose.model('Items');

/**
 * LIST ALL ITEMS 
 * Returns all 'tweets' in the database
 */
module.exports = async function(req, res) {
  try {
    const results = await Item.find({});
    res.json(results);
  } catch (err) {
    logger.ERROR('[LISTALLITEMS] ' + err);
    res.json({status: 'error'});
  }
};
