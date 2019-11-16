'use strict';

const logger = require('./logger');

const nodemailer = require('nodemailer');

const mongoose = require('mongoose');
const User = mongoose.model('Users');

/**
 * ADDUSER 
 * Adds user to database
 * JSON: { username:, password:, email: }
 */
module.exports = function(req, res) { 
  logger.DEBUG('[ADDUSER] received: ' + JSON.stringify(req.body));
 
  if (req.body.username === '') {
    logger.WARN('[ADDUSER] application rejected, no username entered');
    res.json({status: 'error', error: 'no username entered'});
    return;
  }

  if (req.body.password === '') {
    logger.WARN('[ADDUSER] application rejected, no password entered');
    res.json({status: 'error', error: 'no password entered'});
    return;
  }

  if (req.body.email === '') {
    logger.WARN('[ADDUSER] application rejected, no email entered');
    res.json({status: 'error', error: 'no email entered'});
    return;
  }

  const filter = {'username': req.body.username};
  const k = Math.floor(Math.random() * Math.floor(100000));

  const data = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    key: k
  };

  User.findOneAndUpdate(filter, data, {upsert:true}, function(err, user) {
    if (err) {
      logger.ERROR('[ADDUSER] ' + err);
      res.json({status: 'error', error: 'fatal'});
      return;
    }

    if (user !== null) {
      logger.WARN('[ADDUSER] user already exists');
      res.json({status: 'error', error: 'user already exists'});
      return;
    }

    logger.INFO('[ADDUSER] added ' + req.body.username + ' to database');

    const mail_options = {
      from: 'cse356szen@gmail.com',
      to: req.body.email,
      subject: 'verification email',
      text: 'validation key: <' + k + '>'
    };
  
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'cse356szen@gmail.com',
        pass: 'chopitup'
      }
    });

    transporter.sendMail(mail_options, function(err, info) {
      if (err) {
        logger.ERROR('[ADDUSER] ' + err);
        res.json({status: 'error', error: 'fatal'});
        return;
      }

      const tmp = info.response.split(' ');
      const code = tmp[2];

      if (code !== 'OK' ) {
        logger.ERROR('[ADDUSER] ' + JSON.stringify(info, null, 2));
        res.json({status: 'error', error: 'fatal'});
        return;
      }

      logger.INFO('[ADDUSER] email sent to ' + mail_options.to);
      res.json({status: 'OK'});
    });
  });
};
