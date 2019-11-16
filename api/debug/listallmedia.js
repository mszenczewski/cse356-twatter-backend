'use strict';

const logger = require('../logger');
const mongoose = require('mongoose'),
  Media = mongoose.model('Media');

/**
 * LIST ALL MEDIA 
 * Returns all media in the database
 */
module.exports = function(req, res) {
  Media.find({}, function(err, media) {
    if (err) {
      logger.ERROR('[LISTALLMEDIA] ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    }
    res.json(media);
  });
};
