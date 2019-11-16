'use strict';

const logger = require('../logger');

const mongoose = require('mongoose');
const User = mongoose.model('Users');

/**
 * FOLLOWERS
 * Retrieves followers based on username
 */
module.exports = function(req, res) {
  logger.DEBUG('[FOLLOWERS] received: ' + JSON.stringify(req.params, null, 2));
  logger.DEBUG('[FOLLOWERS] received: ' + JSON.stringify(req.query, null, 2));

  //LIMIT
  let limit = 50;
  if (req.query.limit !== null && !isNaN(parseInt(req.query.limit))) {
    limit = req.query.limit;
  }
  if (limit > 200) {
    limit = 200;
  }

  User.findOne({ 'username': req.params.username}, function(err, user) {
      if (err) {
        logger.ERROR('[FOLLOWERS] ' + err);
        res.json({status: 'error', error: 'fatal'});
      }

      if (user === null) {
        logger.ERROR('[FOLLOWERS] ' + err);
        res.json({status: 'error', error: 'user does not exist'}); 
        return;
      }

      let json = {
        status: 'OK',
        users: user.followers,
      };

      logger.INFO('[FOLLOWERS] ' + json.users.length + ' results sent');
      logger.DEBUG('[FOLLOWERS] ' + JSON.stringify(json, null, 2));

      res.send(json);
    }).limit(parseInt(limit));
};
