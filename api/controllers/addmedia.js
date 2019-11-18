'use strict';

const logger = require('../logger');
const formidable = require('formidable');
const fs = require('fs');
const mongoose = require('mongoose'),
  Media = mongoose.model('Media');

/**
 * ADD MEDIA
 * Adds media to the database
 */
module.exports = function(req, res) {
  if (!req.session || !req.session.user) {
    logger.WARN('[ADDMEDIA] user not logged in');
    res.status(403).json({status: 'error', error: 'user not logged in'});
    return;
  }

  const form = new formidable.IncomingForm(); 

  form.parse(req, function (err, fields, files) {
    if (err) {
      logger.ERROR('[ADDMEDIA] ' + err);
      return;
    }

    logger.DEBUG('[ADDMEDIA] files: ' + JSON.stringify(files, null, 2));

    const media = new Media();

    media.content = {
      contentType: files.content.type,
      data: fs.readFileSync(files.content.path)
    }

    media.id = Math.floor(Math.random() * Math.floor(100000));
    media.by = {
      username: req.session.user,
      tweetid: null
    };

    media.save(function(err, media) {
      if (err) {
        logger.ERROR('[ADDMEDIA] ' + err);
        res.status(500).json({status: 'error', error: 'fatal'});
        return;
      }

      logger.INFO('[ADDMEDIA] media ' + media.id + ' added');
      res.status(200).json({status: 'OK', id: media.id});
    });
  });
};
