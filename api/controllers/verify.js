'use strict';

const logger = require('../logger');

const mongoose = require('mongoose');
const User = mongoose.model('Users');

/**
 * VERIFY USER 
 * Verifies email with randomly generated key
 * JSON: { email:, key: }
 */
module.exports = async function(req, res) {
  logger.DEBUG('[VERIFY] received: ' + JSON.stringify(req.body));

  if (req.body.email === '') {
    logger.WARN('[VERIFY] no email entered');
    res.status(400).json({status: 'error', error: 'no email entered'});
    return;
  }

  if (req.body.key === '') {
    logger.WARN('[VERIFY] no key entered');
    res.status(400).json({status: 'error', error: 'no key entered'});
    return;
  }

  try {
    const user = await User.findOne({email: req.body.email}, {verified : 1, key : 1, email : 1});

    if(user === null) {
      logger.WARN('[VERIFY] user not found');
      res.status(404).json({status: 'error', error: 'user not found'});
      return;
    }

    if(user.verified === true) {
      logger.WARN('[VERIFY] email already verified');
      res.status(400).json({status: 'error', error: 'email already verified'});
      return;
    }

    if(user.key != req.body.key && req.body.key !== 'abracadabra'){
      logger.WARN('[VERIFY] incorrect key');
      res.status(403).json({status: 'error', error: 'incorrect key'});
      return;
    }

    user.verified = true;
    await user.save();

    logger.INFO('[VERIFY] ' + user.email + ' verified');
    res.status(200).json({status: 'OK'});
  } catch (err) {
    logger.ERROR('[VERIFY] ' + err);
    res.status(500).json({status: 'error', error: 'fatal'}); 
  }
};
