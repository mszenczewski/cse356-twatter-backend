'use strict';

const logger = require('../logger');

const mongoose = require('mongoose');
const User = mongoose.model('Users');

/**
 * FOLLOWING
 * Searches the database for users that are being followed
 */
module.exports = async function(req, res) {
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

  try {
    const user = await User.findOne({username: req.params.username}).limit(parseInt(limit));

    if (user === null) {
      logger.WARN('[FOLLOWING] user not found');
      res.status(404).json({status: 'error', error: 'user not found'});
      return;
    }

    const json = {status: 'OK', users: user.following};

    logger.INFO('[FOLLOWING] ' + json.users.length + ' results sent');
    logger.DEBUG('[FOLLOWING] ' + JSON.stringify(json, null, 2));

    res.status(200).send(json);
  } catch (err) {
    logger.ERROR('[FOLLOWING] ' + err);
    res.status(500).json({status: 'error', error: 'fatal'});
  }
};
