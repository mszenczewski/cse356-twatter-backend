'use strict';

const logger = require('../logger');

const mongoose = require('mongoose');
const User = mongoose.model('Users');
const Item = mongoose.model('Items');

/**
 * SEARCH
 * Searches the database for 'tweets'
 * JSON: {timestamp:, limit:, q:, username:, following:} 
 */
module.exports = async function(req, res) {
  logger.DEBUG('[SEARCH] received: ' + JSON.stringify(req.body, null, 2));

  const options = {};

  //TIMESTAMP
  if (!req.body.timestamp) {
    let d = new Date();
    let t = d.getTime() / 1000;
    options.timestamp = { $lte: t }; 
  } else {
    options.timestamp = { $lte: req.body.timestamp }; 
  }

  //LIMIT
  let limit = 25;
  if (req.body.limit !== null && !isNaN(parseInt(req.body.limit))) {
    limit = req.body.limit;
  }
  if (limit > 100) {
    limit = 100;
  }

  //Q
  if (req.body.q) {
    options.$text = {$search: req.body.q};
  }

  //USERNAME
  if (req.body.username) {
    options.username = req.body.username;
  }

  if(req.body.following === true && (!req.session || !req.session.user)) {
      logger.WARN('[SEARCH] user not logged in');
      res.json({status: 'error', error: 'user not logged in'});
      return;
  }

  try {
    //FOLLOWING
    if (req.body.following === true) {
      const user = await User.findOne({username: req.session.user});

      if (req.body.username && user.following.indexOf(req.body.username) === -1) {
        logger.WARN('[SEARCH] searched for user not in following list');
        res.json({status: 'OK', items: []});
        return;
      }

      if (!req.body.username) {
        options.username = { $in: user.following };
      }
    }

    logger.DEBUG('[SEARCH] options: ' + JSON.stringify(options, null, 2));

    const results = await Item.find(options).limit(parseInt(limit));

    let json = {
      status: 'OK',
      items: results
    };

    logger.INFO('[SEARCH] ' + json.items.length + ' results sent');
    res.send(json);
    return;

  } catch (err) {
    logger.ERROR('[SEARCH] ' + err);
    res.json({status: 'error', error: 'fatal'});
    return;
  }
};
