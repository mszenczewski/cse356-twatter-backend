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
  logger.DEBUG('[ADDITEM] received: ' + JSON.stringify(req.body, null, 2));

  if (!req.session || !req.session.user) {
    logger.WARN('[ADDITEM] user not logged in');
    res.status(403).json({status: 'error', error: 'user not logged in'});
    return;
  }

  if (!req.body.content) { 
    logger.WARN('[ADDITEM] no content');
    res.status(400).json({status: 'error', error: 'no content'});
    return;
  }

  if (req.body.childType === 'retweet') {
    try {
      await Item.findOneAndUpdate({id: req.body.parent}, {$inc: {'retweeted': 1}});
      logger.INFO(`[ADDITEM] ${req.body.parent} retweeted by ${req.session.user}`);
      res.status(200).json({status: 'OK'});
      return;
    } catch (err) {
      logger.ERROR('[ADDITEM] ' + err);
      res.status(500).json({status: 'error', error: 'fatal'});
      return;
    }
  }

  if (req.body.media) {
    try {
      const results = await Media.find({id: req.body.media}, {by : 1});
      for (var i = 0; i < results.length; i++) {
        if (results[i].by.tweetid !== null) {
          logger.WARN('[ADDITEM] media already has a tweet associated with it');
          res.status(403).json({status: 'error', error: 'media already has a tweet associated with it'});
          return;
        } 
        if (results[i].by.username !== req.session.user) {
          logger.WARN('[ADDITEM] media does not belong to user');
          res.status(403).json({status: 'error', error: 'media does not belong to user'});
          return;
        } 
      }
    } catch (err) {
      logger.ERROR('[ADDITEM] ' + err);
      res.status(500).json({status: 'error', error: 'fatal'});
      return;
    }
  } 

  const temp = {
    id: Math.floor(Math.random() * Math.floor(100000)),
    username: req.session.user,
    property: {likes: 0},
    retweeted: 0,
    content: req.body.content,
    timestamp: Date.now() / 1000,
    childType: req.body.childType
  };

  if (req.body.parent) {
    temp.parent = req.body.parent;
  }

  if (req.body.media) {
    temp.media = req.body.media;
  }

  try {
    const item = await Item.create(temp);
    
    if (req.body.media) {
      for (let i = 0; i < req.body.media.length; i++) {
        await Media.findOneAndUpdate({id: req.body.media[i]}, {'by.tweetid': item.id});
      }
    }
    
    logger.INFO('[ADDITEM] item ' + item.id + ' added');

    res.status(200).json({status: 'OK', id: item.id});
    return;
  } catch (err) {
    logger.ERROR('[ADDITEM] ' + err);
    res.status(500).json({status: 'error', error: 'fatal'});
    return;
  }  
};
