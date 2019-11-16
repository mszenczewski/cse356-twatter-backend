'use strict';

const logger = require('../logger');

const mongoose = require('mongoose');
const User = mongoose.model('Users');

/**
 * FOLLOWING
 * Searches the database for users that are being followed
 */
module.exports = function(req, res) {
  logger.DEBUG('[FOLLOWING] received: ' + JSON.stringify(req.params, null, 2));
  logger.DEBUG('[FOLLOWING] received: ' + JSON.stringify(req.query, null, 2));

  //LIMIT
  let limit = 25;
  if (req.query.limit !== null && !isNaN(parseInt(req.query.limit))) {
    limit = req.query.limit;
  }
  if (limit > 100) {
    limit = 100;
  }

  const filter = {username: req.params.username};

  User.findOne(filter, function(err, user) {
    if (err) {
      logger.ERROR('[FOLLOWING] ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    }

    if (user === null) {
      logger.WARN('[FOLLOWING] user not found');
      res.json({status: 'error', error: 'user not found'});
      return;
    }

    const json = {
      status: 'OK',
      users: user.following
    };

    logger.INFO('[FOLLOWING] ' + json.users.length + ' results sent');
    logger.DEBUG('[FOLLOWING] ' + JSON.stringify(json, null, 2));

    res.send(json);
  }).limit(parseInt(limit));
};
