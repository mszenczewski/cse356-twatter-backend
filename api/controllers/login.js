'use strict';

const logger = require('../logger');

const mongoose = require('mongoose');
const User = mongoose.model('Users');

/** 
 * LOGIN 
 * Logs user in
 * JSON: { username:, password: }
 */
module.exports = async function(req, res) {
  logger.DEBUG('[LOGIN] received: ' + JSON.stringify(req.body));

  if (req.body.username === '') {
    logger.WARN('[LOGIN] no username entered');
    res.status(400).json({status: 'error', error: 'no username entered'});
    return;
  }

  if (req.body.password === '') {
    logger.WARN('[LOGIN] no password entered');
    res.status(400).json({status: 'error', error: 'no password entered'});
    return;
  }

  try {
    const user = await User.findOne({'username': req.body.username, 'password': req.body.password}, {username : 1, verified : 1});

    if (user === null) {
      logger.WARN('[LOGIN] incorrect login attempt');
      res.status(403).json({status: 'error', error: 'incorrect login'});
      return;
    }

    if (user.verified != true) {
      logger.WARN('[LOGIN] user not verified');
      res.status(403).json({status: 'error', error: 'user not verified'});
      return;
    }

    logger.INFO('[LOGIN] ' + user.username + ' logged in');
    req.session.user = user.username;
    res.json({status: 'OK'});
  } catch (err) {
    logger.ERROR('[LOGIN] ' + err);
    res.status(500).json({status: 'error', error: 'fatal'});
  }
};
