'use strict';

const logger = require('./logger');

const mongoose = require('mongoose');
const User = mongoose.model('Users');

/** 
 * LOGIN 
 * Logs user in
 * JSON: { username:, password: }
 */
module.exports = function(req, res) {
  logger.DEBUG('[LOGIN] received: ' + JSON.stringify(req.body));

  if (req.body.username === '') {
    logger.WARN('[LOGIN] no username entered');
    res.json({status: 'error', error: 'no username entered'});
    return;
  }

  if (req.body.password === '') {
    logger.WARN('[LOGIN] no password entered');
    res.json({status: 'error', error: 'no password entered'});
    return;
  }

  User.findOne(
    { 'username': req.body.username, 'password': req.body.password},
    function(err, user) {
      if (err) {
        logger.ERROR('[LOGIN] ' + err);
        res.json({status: 'error', error: 'fatal'});
        return;
      }

      if (user === null) {
        logger.WARN('[LOGIN] could not find user');
        res.json({status: 'error', error: 'incorrect login'});
        return;
      }

      if (user.verified != true) {
        logger.WARN('[LOGIN] user not verified');
        res.json({status: 'error', error: 'user not verified'});
        return;
      }

      logger.INFO('[LOGIN] ' + user.username + ' logged in');
      req.session.user = user.username;
      res.json({status: 'OK'});
    }
  );
};
