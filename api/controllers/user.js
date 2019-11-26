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
    const user = await User.findOne({'username': req.params.username});

    if (user === null) {
      logger.WARN('[USER] user not found');
      res.status(404).json({status: 'error', error: 'user not found'});
      return;
    }

    const json = {
      status: 'OK',
      user: {
        email: user.email,
        followers: user.followers.length,
        following: user.following.length
      }
    }

    logger.INFO('[FOLLOWING] ' + user.username + ' info sent');
    logger.DEBUG('[FOLLOWING] ' + JSON.stringify(json, null, 2));

    res.send(json);

  } catch (err) {
    logger.ERROR('[USER] ' + err);
    res.status(500).json({status: 'error', error: 'fatal'}); 
  }
};
