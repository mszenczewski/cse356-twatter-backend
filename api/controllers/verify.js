'use strict';

const logger = require('./logger');

const mongoose = require('mongoose');
const User = mongoose.model('Users');

/**
 * VERIFY USER 
 * Verifies email with randomly generated key
 * JSON: { email:, key: }
 */
module.exports = function(req, res) {
  logger.DEBUG('[VERIFY] received: ' + JSON.stringify(req.body));

  if (req.body.email === '') {
    logger.WARN('[VERIFY] no email entered');
    res.json({status: 'error', error: 'no email entered'});
    return;
  }

  if (req.body.key === '') {
    logger.WARN('[VERIFY] no key entered');
    res.json({status: 'error', error: 'no key entered'});
    return;
  }

  User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
      logger.ERROR('[VERIFY] ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    }

    if(user === null) {
      logger.WARN('[VERIFY] user not found');
      res.json({status: 'error', error: 'user not found'});
      return;
    }

    if(user.key !== req.body.key && req.body.key !== 'abracadabra'){
      logger.WARN('[VERIFY] incorrect key');
      res.json({status: 'error', error: 'incorrect key'});
      return;
    }

    user.verified = true;

    user.save(function(err, user) {
      if (err) {
        logger.ERROR('[VERIFY] ' + err);
        res.json({status: 'error', error: 'fatal'});
        return;
      }
      logger.INFO('[VERIFY] ' + user.email + ' verified');
      res.json({status: 'OK'});
    });
  });
};
