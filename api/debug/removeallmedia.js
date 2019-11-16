'use strict';

const logger = require('../logger');
const mongoose = require('mongoose'),
  Media = mongoose.model('Media');

/**
 * REMOVE ALL MEDIA 
 * Removes all media from database
 */
module.exports = function(req, res) {
  Media.deleteMany({}, function(err) {
    if (err) {
      logger.ERROR('[REMOVEALLMEDIA]: ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    }
    logger.INFO('[REMOVEALLMEDIA] all media removed');
    res.json({status: 'OK'});
  });
};
