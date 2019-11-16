'use strict';

const logger = require('../logger');

const mongoose = require('mongoose');
const Item = mongoose.model('Items');

/**
 * POSTS
 * Retrieves posts based on username
 */
module.exports = function(req, res) {
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

  const options = { 'username': req.params.username};

  Item.find(options, function(err, results) {
      if (err) {
        logger.ERROR('[POSTS] ' + err);
        res.json({status: 'error', error: 'fatal'});
      }

      var items = results.map(item => item.id);

      let json = {
        status: 'OK',
        items: items,
      };

      logger.INFO('[POSTS] ' + json.items.length + ' results sent');
      logger.DEBUG('[POSTS] ' + JSON.stringify(json, null, 2));

      res.send(json);
    }).limit(parseInt(limit));
};
