'use strict';

const mongoose = require('mongoose');
const Item = mongoose.model('Items');

const logger = require('../logger');

/**
 * LIST ALL ITEMS 
 * Returns all 'tweets' in the database
 */
module.exports = function(req, res) {
  Item.find({}, function(err, items) {
    if (err) {
      logger.ERROR('[LISTALLITEMS] ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    }
    res.json(items);
  });
};
