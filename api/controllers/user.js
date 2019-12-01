'use strict';

const logger = require('../logger');

const mongoose = require('mongoose');
const User = mongoose.model('Users');

/**
 * USER
 * Retrieves user based on username
 */
module.exports = async function(req, res) {
  logger.DEBUG('[USER] received: ' + JSON.stringify(req.params));

  try {
    const u = await User.findOne({'username': req.params.username}, {username : 1, email : 1, followers : 1, following : 1});

    if (u === null) {
      logger.WARN('[USER] user not found');
      res.status(404).json({status: 'error', error: 'user not found'});
      return;
    }

    const json = {
      status: 'OK',
      user: {
        email: u.email,
        followers: u.followers.length,
        following: u.following.length
      }
    }

    logger.INFO('[FOLLOWING] ' + u.username + ' info sent');
    logger.DEBUG('[FOLLOWING] ' + JSON.stringify(json, null, 2));

    res.send(json);

  } catch (err) {
    logger.ERROR('[USER] ' + err);
    res.status(500).json({status: 'error', error: 'fatal'}); 
  }
};
