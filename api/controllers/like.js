'use strict';

const logger = require('../logger');
const mongoose = require('mongoose'),
  User = mongoose.model('Users'),
  Item = mongoose.model('Items');

/**
 * LIKE
 * Like an item based on ID
 */
module.exports = async function(req, res) {
  logger.DEBUG('[LIKE] received: ' + JSON.stringify(req.params) + ' ' + JSON.stringify(req.body));

  if (!req.session || !req.session.user) {
    logger.WARN('[LIKE] user not logged in');
    res.json({status: 'error', error: 'user not logged in'});
    return;
  }

  if (req.body.like) {
    var item_update = {$inc: {'property.likes': 1}};
    var user_update = {$addToSet: {liked: req.params.id}};
  } else {
    var item_update = {$inc: {'property.likes': -1}};
    var user_update = {$pull: {liked: req.params.id}};
  }
  
  try {
    const user = await User.findOne({username: req.session.user});

    if (req.body.like && user.liked.includes(req.params.id)) {
      logger.WARN(`[LIKE] ${req.session.user} has already liked this item`);
      res.json({status: 'error', error: 'you have already liked this item'});
      return;
    }

    if (!req.body.like && !user.liked.includes(req.params.id)) {
      logger.WARN(`[LIKE] ${req.session.user} has not liked this item`);
      res.json({status: 'error', error: 'you have not liked this item'});
      return;
    }

    const item = await Item.findOneAndUpdate({id: req.params.id}, item_update);

    if (item === null) {
      logger.WARN('[LIKE] item not found');
      res.json({status: 'error', error: 'item not found'});
      return;
    }

    await User.findOneAndUpdate({username: req.session.user}, user_update);

    if (req.body.like) var msg = 'liked';
    if (!req.body.like) var msg = 'unliked';
    logger.INFO(`[LIKE] ${user.username} ${msg} ${item.id}`);

    res.json({status: 'OK'});
  } catch (err) {
    logger.ERROR('[LIKE] ' + err);
    res.json({status: 'error', error: 'fatal'});
  }
};
