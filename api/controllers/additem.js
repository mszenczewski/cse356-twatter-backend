'use strict';

const logger = require('./logger');

const mongoose = require('mongoose');
const Item = mongoose.model('Items');

/**
 * ADD ITEM
 * Adds a 'tweet' to the database
 * JSON: {content:, childType: } 
 */
module.exports = function(req, res) {
  logger.DEBUG('[ADDITEM] received: ' + JSON.stringify(req.body));

  if (!req.session || !req.session.user) {
    logger.WARN('[ADDITEM] user not logged in');
    res.json({status: 'error', error: 'user not logged in'});
    return;
  }

  if (!req.body.content) { 
    logger.WARN('[ADDITEM] no content');
    res.json({status: 'error', error: 'no content'});
    return;
  }

  const id = Math.floor(Math.random() * Math.floor(100000));
  req.body.id = id;

  const d = new Date();
  req.body.timestamp = d.getTime() / 1000; 

  req.body.username = req.session.user;
  req.body.property = {likes: 0};
  req.body.retweeted = 0;

  var new_item = new Item(req.body);

  new_item.save(function(err, item) {
    if (err) {
      logger.ERROR('[ADDITEM] ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    }

    logger.INFO('[ADDITEM] item ' + item.id + ' added');
    res.json({status: 'OK', id: item.id});
  });
};
