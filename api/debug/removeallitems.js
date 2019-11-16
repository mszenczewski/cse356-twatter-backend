'use strict';

const mongoose = require('mongoose');
const Item = mongoose.model('Items');

const logger = require('../logger');

/**
 * REMOVE ALL ITEMS 
 * Removes all 'tweets' from database
 */
module.exports = function(req, res) {
  logger.DEBUG('[REMOVEALLITEMS] received ' + req);
  Item.deleteMany({}, function(err) {
    if (err) {
      logger.ERROR('[REMOVEALLITEMS]: ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    }
    logger.INFO('[REMOVEALLITEMS] all items removed');
    res.json({status: 'OK'});
  });
};
