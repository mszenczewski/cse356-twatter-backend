'use strict';

const logger = require('../logger');
const mongoose = require('mongoose'),
  Media = mongoose.model('Media');

/**
 * REMOVE ALL MEDIA 
 * Removes all media from database
 */
module.exports = async function(req, res) {
  try {
    await Media.deleteMany({});
    logger.INFO('[REMOVEALLMEDIA] all media removed');
    res.json({status: 'OK'});
  } catch (err) {
    logger.ERROR('[REMOVEALLMEDIA] ' + err);
    res.json({status: 'error'});
  }
};
