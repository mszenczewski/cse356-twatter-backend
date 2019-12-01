'use strict';

const logger = require('../logger');

const nodemailer = require('nodemailer');

const mongoose = require('mongoose');
const User = mongoose.model('Users');

/**
 * ADDUSER 
 * Adds user to database
 * JSON: { username:, password:, email: }
 */
module.exports = async function(req, res) { 
  logger.DEBUG('[ADDUSER] received: ' + JSON.stringify(req.body));
 
  if (req.body.username === '') {
    logger.WARN('[ADDUSER] application rejected, no username entered');
    res.status(400).json({status: 'error', error: 'no username entered'});
    return;
  }

  if (req.body.password === '') {
    logger.WARN('[ADDUSER] application rejected, no password entered');
    res.status(400).json({status: 'error', error: 'no password entered'});
    return;
  }

  if (req.body.email === '') {
    logger.WARN('[ADDUSER] application rejected, no email entered');
    res.status(400).json({status: 'error', error: 'no email entered'});
    return;
  }

  const random_key = Math.floor(Math.random() * Math.floor(100000));

  const mail_options = {
    from: 'no-reply@gaillardia.cse356.compas.cs.stonybrook.edu',
    to: req.body.email,
    subject: 'verification email',
    text: 'validation key: <' + random_key + '>'
  };

  const transporter = nodemailer.createTransport({
    host: argv.mail,
    port: 2525,
    secure: false,
    tls:{rejectUnauthorized: false}
  });

  try {
    //ADD USER
    const u = await User.findOne({'username': req.body.username}, {username : 1});

    if (u !== null) {
      logger.WARN('[ADDUSER] user already exists');
      res.status(400).json({status: 'error', error: 'user already exists'});
      return;
    }

    const user = new User();

    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    user.key = random_key;

    await user.save();

    logger.INFO('[ADDUSER] added ' + req.body.username + ' to database');
    logger.DEBUG('[ADDUSER] user: ' + JSON.stringify(user, null, 2));

    res.status(200).json({status: 'OK'});

    //SEND EMAIL
    const info = await transporter.sendMail(mail_options);

    const tmp = info.response.split(' ');
    const code = tmp[0];

    if (code.charAt(0) != 2 ) {
      logger.ERROR('[ADDUSER] ' + JSON.stringify(info, null, 2));
    } else {
      logger.INFO('[ADDUSER] email sent to ' + mail_options.to);
    }
  } catch (err) {
      logger.ERROR('[ADDUSER] ' + err);
  }
};
