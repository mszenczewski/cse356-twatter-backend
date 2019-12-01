'use strict';

const logger = require('../logger');

const mongoose = require('mongoose');
const Item = mongoose.model('Items');

/**
 * POSTS
 * Retrieves posts based on username
 */
module.exports = async function(req, res) {
  logger.DEBUG('[POSTS] received: ' + JSON.stringify(req.params, null, 2));
  logger.DEBUG('[POSTS] received: ' + JSON.stringify(req.query, null, 2));

  //LIMIT
  let limit = 50;
  if (req.query.limit !== null && !isNaN(parseInt(req.query.limit))) {
    limit = req.query.limit;
  }
  if (limit > 200) {
    limit = 200;
  }

  try {
    const results = await Item.find({'username': req.params.username}).limit(parseInt(limit));
    const items = results.map(item => item.id);

    logger.INFO('[POSTS] ' + items.length + ' results sent');
    logger.DEBUG('[POSTS] ' + JSON.stringify(json, null, 2));

    res.send({status: 'OK', items: items});
  } catch (err) {
    logger.ERROR('[POSTS] ' + err); 
    res.status(500).json({status: 'error', error: 'fatal'});
  }
};
