'use strict';

const logger = require('./logger');

const mongoose = require('mongoose');
const Item = mongoose.model('Items');

/**
 * DELETE 
 * Removes a 'tweet' from database
 */
module.exports = function(req, res) {
  logger.DEBUG('[DELETE] received: ' + JSON.stringify(req.params));

  if (!req.session || !req.session.user) {
    logger.WARN('[DELETE] user not logged in');
    res.status(403).json({status: 'error', error: 'user not logged in'});
    return;
  }

  Item.findOne({'id': req.params.id}, function(err, item) {
    if (err) {
      logger.ERROR('[DELETE]: ' + err);
      res.status(500).json({status: 'error', error: 'fatal'});
      return;
    }

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

    Item.deleteOne({id: req.params.id}, function(err, item) {
      if (err) {
        logger.ERROR('[DELETE]: ' + err);
        res.status(500).json({status: 'error', error: 'fatal'});
        return;
      }
      logger.INFO('[DELETE] ' + req.params.id + ' removed');
      res.status(200).json({status: 'OK'});
    });
  });
};
