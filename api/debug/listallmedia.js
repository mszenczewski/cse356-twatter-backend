'use strict';

const logger = require('../logger');
const mongoose = require('mongoose'),
  Media = mongoose.model('Media');

/**
 * LIST ALL MEDIA 
 * Returns all media in the database
 */
module.exports = async function(req, res) {
  try {
    const results = await Media.find({});

    for (var i = 0; i < results.length; i++) {
      results[i].content.data = null;
    }

    res.json(results);
  } catch (err) {
    logger.ERROR('[LISTALLMEDIA] ' + err);
    res.json({status: 'error', error: 'fatal'});
  }
};
