'use strict';

const logger = require('./logger');

const mongoose = require('mongoose');
const User = mongoose.model('Users');

/**
 * FOLLOW
 * Follows another user
 * JSON: {username:, follow: } 
 */
module.exports = function(req, res) {
  logger.DEBUG('[FOLLOW] received: ' + JSON.stringify(req.body, null, 2));

  if (req.body.username === '') {
    logger.WARN('[FOLLOW] request rejected, no username entered');
    res.json({status: 'error', error: 'no username entered'});
    return;
  }

  if (req.body.follow !== true && req.body.follow !== false) {
    logger.WARN('[FOLLOW] request rejected, no follow entered');
    res.json({status: 'error', error: 'no follow entered'});
    return;
  }

  if (!req.session || !req.session.user) {
    logger.WARN('[FOLLOW] user not logged in');
    res.json({status: 'error', error: 'user not logged in'});
    return;
  }

  if (req.body.follow) {
    var update = {$addToSet: {'followers': req.session.user}};
  } else {
    var update = {$pull: {'followers': req.session.user}};
  }

  const filter = {'username': req.body.username};

  User.findOneAndUpdate(filter, update, function(err, user) {
    if (err) {
      logger.ERROR('[FOLLOW] ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    } 

    if (user === null) {
      logger.WARN('[FOLLOW] could not find user');
      res.json({status: 'error', error: 'could not find user'});
      return;
    }

    if (req.body.follow) {
      logger.INFO('[FOLLOW] added ' + req.session.user + ' to ' + req.body.username + "'s follower list");
    } else {
      logger.INFO('[FOLLOW] removed ' + req.session.user + ' to ' + req.body.username + "'s follower list");
    }
  });

  if (req.body.follow) {
    var update2 = {$addToSet: {'following': req.body.username}};
  } else {
    var update2 = {$pull: {'following': req.body.username}};
  }

  const filter2 = {'username': req.session.user};

  User.findOneAndUpdate(filter2, update2, function(err, user) {
    if (err) {
      logger.ERROR('[FOLLOW] ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    } 

    if (user === null) {
      logger.WARN('[FOLLOW] could not find user');
      res.json({status: 'error', error: 'could not find user'});
      return;
    }

    if (req.body.follow) {
      logger.INFO('[FOLLOW] added ' + req.body.username + ' to ' + req.session.user + "'s following list");
    } else {
      logger.INFO('[FOLLOW] removed ' + req.body.username + ' to ' + req.session.user + "'s following list");
    }
  });

  res.json({status: 'OK'});
};
