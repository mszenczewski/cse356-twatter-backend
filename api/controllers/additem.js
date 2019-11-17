'use strict';

const logger = require('../logger');

const mongoose = require('mongoose'),
  Item = mongoose.model('Items'),
  Media = mongoose.model('Media');

/**
 * ADD ITEM
 * Adds a 'tweet' to the database
 * JSON: {content: childType: parent: media:} 
 */
module.exports = async function(req, res) {
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

  if (req.body.childType === 'retweet') {
    try {
      await Item.findOneAndUpdate({id: req.body.parent}, {$inc: {retweeted: 1}});
      logger.INFO(`[ADDITEM] ${req.body.parent} retweeted by ${req.session.user}`);
      res.json({status: 'OK'});
      return;
    } catch (err) {
      logger.ERROR('[ADDITEM] ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    }
  }

  if (req.body.media) {
    try {
      const results = await Media.find({id: req.body.media});
      for (var i = 0; i < results.length; i++) {
        if (results[i].by.tweetid !== null) {
          logger.WARN('[ADDITEM] media already has a tweet associated with it');
          res.json({status: 'error', error: 'media already has a tweet associated with it'});
          return;
        } 
        if (results[i].by.username !== req.session.user) {
          logger.WARN('[ADDITEM] media does not belong to user');
          res.json({status: 'error', error: 'media does not belong to user'});
          return;
        } 
      }
    } catch (err) {
      logger.ERROR('[ADDITEM] ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    }
  }

  const temp = {
    id: Math.floor(Math.random() * Math.floor(100000)),
    username: req.session.user,
    property: {likes: 0},
    retweeted: 0,
    content: req.body.content,
    timestamp: Date.now() / 1000
  };

  if (req.body.parent) {
    temp.parent = req.body.parent;
  }

  if (req.body.media) {
    temp.media = req.body.media;
  }

  try {
    const item = await Item.create(temp);
    await Media.findOneAndUpdate({id: req.body.media}, {'by.tweetid': item.id});
    logger.INFO('[ADDITEM] item ' + item.id + ' added');
    res.json({status: 'OK', id: item.id});
    return;
  } catch (err) {
    logger.ERROR('[ADDITEM] ' + err);
    res.json({status: 'error', error: 'fatal'});
    return;
  }  
};
