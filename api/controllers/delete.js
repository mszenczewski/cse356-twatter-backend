'use strict';

const logger = require('../logger');
const mongoose = require('mongoose'),
  Item = mongoose.model('Items'),
  Media = mongoose.model('Media');

/**
 * DELETE 
 * Removes a 'tweet' from database
 */
module.exports = async function(req, res) {
  logger.DEBUG('[DELETE] received: ' + JSON.stringify(req.params));

  if (!req.session || !req.session.user) {
    logger.WARN('[DELETE] user not logged in');
    res.status(403).json({status: 'error', error: 'user not logged in'});
    return;
  }

  try {
    const item = await Item.findOne({'id': req.params.id});

    if (item === null) {
      logger.ERROR('[WARN]: item not found');
      res.status(500).json({status: 'error', error: 'item not found'});
      return;
    }

    if (item.username !== req.session.user) {
      logger.WARN('[DELETE]: user not authorized to delete this item');
      res.status(403).json({status: 'error', error: 'user not authorized to delete this item'});
      return;
    }

    if (item.username !== req.session.user) {
      logger.WARN('[DELETE]: user not authorized to delete this item');
      res.status(403).json({status: 'error', error: 'user not authorized to delete this item'});
      return;
    }

    if (item.media) {
      const results = await Media.deleteMany({id: {$in: item.media}});
      logger.INFO('[DELETE] ' + results + ' removed');
    }

    await Item.deleteOne({id: req.params.id});

    logger.INFO('[DELETE] ' + req.params.id + ' removed');
    res.status(200).json({status: 'OK'});

  } catch (err) {
    logger.ERROR('[DELETE]: ' + err);
    res.status(500).json({status: 'error', error: 'fatal'});
  }
};
