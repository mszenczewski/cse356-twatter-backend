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
module.exports = async function(req, res) {
  if (!req.session || !req.session.user) {
    logger.WARN('[ADDMEDIA] user not logged in');
    res.status(403).json({status: 'error', error: 'user not logged in'});
    return;
  }

  const form = new formidable.IncomingForm(); 

  const random_id = Math.floor(Math.random() * Math.floor(100000));

  res.status(200).json({status: 'OK', id: `${random_id}`});

  form.parse(req, async function (err, fields, files) {
    if (err) {
      logger.ERROR('[ADDMEDIA] ' + err);
      return;
    }

    const upload_dir = './media/';

    if (!fs.existsSync(upload_dir)){
      fs.mkdirSync(upload_dir);
    }

    const old_path = files.content.path;
    const new_path = `${upload_dir}${random_id}`;

    fs.rename(old_path, new_path, function (err) {
      if (err) {
        logger.ERROR('[ADDMEDIA] ' + err);
        return;
      }

      logger.DEBUG('[ADDMEDIA] files: ' + JSON.stringify(files, null, 2));

      const media = new Media();

      media.filetype = files.content.type;
      media.path = new_path;
      media.id = random_id;
      media.by = {
        username: req.session.user,
        tweetid: null
      };

      logger.DEBUG('[ADDMEDIA] media: ' + JSON.stringify(media, null, 2));

      media.save(function(err, media) {
        if (err) {
          logger.ERROR('[ADDMEDIA] ' + err);
          return;
        }
        logger.INFO('[ADDMEDIA] media ' + media.id + ' added');
      });
    });
  });
};
