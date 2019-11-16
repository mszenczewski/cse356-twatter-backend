'use strict';

const logger = require('./logger');

/**
 * LOGOUT
 * Logs user out
 */
module.exports = function(req, res) {
  logger.DEBUG('[LOGOUT] received: ' + JSON.stringify(req.body));

  if (!req.session || !req.session.user) {
    logger.WARN('[LOGOUT] user not logged in');
    res.json({status: 'error', error: 'user not logged in'});
    return;
  }
  logger.INFO('[LOGOUT] ' + req.session.user + ' logged out');
  req.session.reset();
  res.json({status: 'OK'});
};
