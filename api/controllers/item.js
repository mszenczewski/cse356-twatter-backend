'use strict';

const logger = require('../logger');

const mongoose = require('mongoose');
const Item = mongoose.model('Items');

/**
 * ITEM
 * Retrieves and item based on ID
 */
module.exports = async function(req, res) {
  logger.DEBUG('[ITEM] received: ' + JSON.stringify(req.params));

  try {
    const item = await Item.findOne({'id': req.params.id});

    if (item === null) {
      logger.WARN('[ITEM] item not found');
      res.status(404).json({status: 'error', error: 'item not found'});
      return;
    }

    const json = {
      status: 'OK', 
      item: {
        content: item.content,
        id: item.id,
        username: item.username,
        property: item.property,
        retweeted: item.retweeted,
        timestamp: item.timestamp,
        parent: item.parent,
        media: item.media
        }
    };

    logger.INFO('[ITEM] ' + item.id + ' found');
    res.status(200).send(json);

  } catch (err) {
    logger.ERROR('[ITEM] ' + err);
    res.status(500).json({status: 'error', error: 'fatal'});
  }
};
