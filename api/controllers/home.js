'use strict';

const logger = require('../logger');

/**
 * HOME
 * Redirects the / GET request to the React server URL
 */
module.exports = function(req, res) {
  logger.DEBUG('[HOME] received: ' + JSON.stringify(req.body));
  res.redirect('twatter');
}
