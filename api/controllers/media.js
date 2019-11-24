'use strict';

const logger = require('../logger');
const fs = require('fs');
const mongoose = require('mongoose'),
  Media = mongoose.model('Media');

/**
 * MEDIA
 * Retrieves a media based on ID
 */
module.exports = async function(req, res) {
  logger.DEBUG('[MEDIA] received: ' + JSON.stringify(req.params));

  try {
    const media = await Media.findOne({'id': req.params.id});

    if (media === null) {
      logger.WARN('[MEDIA] media not found');
      res.status(404).json({status: 'error', error: 'media not found'});
      return;
    }

    logger.DEBUG('[MEDIA] found: ' + JSON.stringify(media, null, 2));

    const stat = fs.statSync(media.path);

    res.writeHead(200, {
      'Content-Type': media.filetype,
      'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(media.path);
    readStream.pipe(res);

    logger.INFO('[MEDIA] ' + media.id + ' found');

  } catch (err) {
    logger.ERROR('[MEDIA] ' + err);
  }
};