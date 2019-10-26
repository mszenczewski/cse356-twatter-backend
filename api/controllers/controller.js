'use strict';

var nodemailer = require('nodemailer');

var mongoose = require('mongoose'),
  User = mongoose.model('Users'),
  Item = mongoose.model('Items');

exports.home = function(req, res) {
  res.redirect('twatter');
}

const log_padding = 8;
const log = {
  OK: '<OK>'.padEnd(log_padding),
  ERROR: '<ERROR>'.padEnd(log_padding),
  WARN: '<WARN>'.padEnd(log_padding),
  INFO: '<INFO>'.padEnd(log_padding),
}

/***********************/
/* ADDUSER 
/* { username:, password:, email: }
/***********************/
exports.add_user = function(req, res) {
  let key = Math.floor(Math.random() * Math.floor(100000));
  req.body.key = key;
  var new_user = new User(req.body);

  var mail_options = {
    from: 'cse356szen@gmail.com',
    to: req.body.email,
    subject: 'verification email',
    text: 'validation key: <' + key + '>'
  };

  var transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth: {
      user: 'cse356szen@gmail.com',
      pass: 'chopitup'
    }
  });

  transporter.sendMail(mail_options, function(err, info){
    if (err) {
      console.log(log.ERROR + 'ADDUSER: ' + err);
      res.json({status:"error", error: 'fatal'});
      return;
    }
    let tmp = info.response.split(' ');
    let code = tmp[2];

    if (code != 'OK' )
    {
      console.log(log.ERROR + 'ADDUSER: ' + JSON.stringify(info, null, 2));
      res.json({status:"error", error: 'fatal'});
      return;
    }

    console.log(log.OK + ' email sent to ' + mail_options.to);
  });

  new_user.save(function(err, user) {
    if (err) {
      console.log(log.ERROR + 'ADDUSER: ' + err);
      res.json({status:"error", error: 'fatal'});
      return;
    }
    console.log(log.OK + 'ADDUSER: added ' + user.username + ' to database');
    res.json({status:"OK"});
  });
};

/***********************/
/* LOGIN 
/* { username:, password: }
/***********************/
exports.login = function(req, res) {
  User.findOne(
    { 'username': req.body.username, 
      'password': req.body.password},
    function(err, user) {
      if (err) {
        console.log(log.ERROR + 'LOGIN:' + err);
        res.json({status: "error", error: 'fatal'});
        return;
      }

      if (user === null) {
        console.log(log.WARN + 'LOGIN: could not find user');
        res.json({status: "error", error: 'incorrect login'});
        return;
      }

      if (user.verified != true) {
        console.log(log.WARN + 'LOGIN: user not verified');
        res.json({status: "error", error: 'user not verified'});
        return;
      }

      console.log(log.OK + 'LOGIN: ' + user.username + ' logged in');
      req.session.user = user.username;
      res.json({status: "OK"});
    });
};

/***********************/
/* VERIFY USER 
/* { email:, key: }
/***********************/
exports.verify = function(req, res) {
  if (req.body.key === "abracadabra") {
    console.log(log.OK + 'VERIFY: abracadabra recieved');
    User.findOneAndUpdate(
      {email: req.body.email}, 
      {$set:{verified:true}},
      function(err, user) {
        if (err) {
          console.log(log.ERROR + 'VERIFY: ' + err);
          res.json({status:"error", error: 'fatal'});
          return;
        }
        console.log(log.OK + 'VERIFY: ' + user.email + ' verified');
        res.json({status:"OK"});
      }
    );
    return;
  }

  User.findOne(
    {email: req.body.email}, 
    function(err, user) {
      if (err) {
        console.log(log.ERROR + 'VERIFY: ' + err);
        res.json({status:"error", error: 'fatal'});
        return;
      }

      if(user === null) {
        console.log(log.WARN + 'VERIFY: user not found');
        res.json({status:"error", error:"user not found"});
        return;
      }

      if(user.key != req.body.key){
        console.log(log.WARN + 'VERIFY: incorrect key');
        res.json({status:"error", error:"incorrect key"});
        return;
      }

      User.findOneAndUpdate(
        {email: req.body.email}, 
        {$set:{verified:true}},
        function(err, user) {
          if(err){
            console.log(log.ERROR + 'VERIFY: ' + err);
            res.json({status:"error", error: 'fatal'});
            return;
          }
          console.log(log.OK + 'VERIFY: ' + user.email + ' verified');
          res.json({status:"OK"});
        }
      );
      
    }
  );
};

/***********************/
/* ADD ITEM
/* {content:, childType: } 
/***********************/
exports.additem = function(req, res) {
  if (!req.session || !req.session.user) {
    console.log(log.WARN + 'ADDITEM: user not logged in');
    res.json({status: "error", error:'user not logged in'});
    return;
  }

  if (!req.body.content) { 
    console.log(log.WARN + 'ADDITEM: no content');
    res.json({status: "error", error:'no content'});
    return;
  }

  let id = Math.floor(Math.random() * Math.floor(100000));
  req.body.id = id;

  let d = new Date();
  req.body.timestamp = d.getTime() / 1000; 

  req.body.username = req.session.user;
  req.body.property = {likes: 0};
  req.body.retweeted = 0;

  var new_item = new Item(req.body);

  new_item.save(function(err, item) {
    if (err) {
      console.log(log.ERROR + 'ADDITEM: ' + err);
      res.json({status: "error", error:'fatal'});
      return;
    }

    console.log(log.OK + 'ADDITEM: ' + item.id + 'added');
    res.json({status:'OK', id: item.id});
  });
};

/***********************/
/* ITEM
/***********************/
exports.item = function(req, res) {
  Item.findOne(
    { 'id': req.params.id},
    function(err, item) {
      if (err) {
        console.log(log.ERROR + 'ITEM: ' + err);
        res.json({status: "error", error:'fatal'});
        return;
      }

      if (item === null) {
        console.log(log.WARN + 'ITEM: item not found');
        res.json({status: "error", error:'item not found'});
        return;
      }

      let json = {
        status: 'OK', 
        item: {
          content: item.content,
          id: item.id,
          username: item.username,
          property: item.property,
          retweeted: item.retweeted,
          timestamp: item.timestamp,
          }
      };

      console.log(log.OK + 'ITEM: ' + item.id +' found');
      res.send(json);
    });
};

/***********************/
/* SEARCH
/* {timestamp:, limit: } 
/***********************/
exports.search = function(req, res) {
  let timestamp = req.body.timestamp;

  if (!req.body.timestamp) {
    let d = new Date();
    timestamp = d.getTime() / 1000; 
  }

  let limit = 25;

  if (req.body.limit != null) {
    limit = req.body.limit;
  }

  if (limit > 100) {
    limit = 100;
  }

  console.log(log.OK + 'SEARCH: query: ' + timestamp + ', ' + limit);

  Item.find({timestamp: {$lte: timestamp}}, 
    function(err, results) {
      if (err) {
        console.log(log.ERROR + 'SEARCH: ' + err);
        res.json({status: "error", error:'fatal'});
      }

      let json = {
        status:'OK',
        items: results,
      };

      console.log(log.OK + 'SEARCH: ' + json.items.length + ' results sent');
      res.send(json);
    }).limit(parseInt(limit));
};

/***********************/
/* LOGOUT
/***********************/
exports.logout = function(req, res) {
  if (!req.session || !req.session.user) {
    console.log(log.WARN + 'LOGOUT: user not logged in');
    res.json({status: "error", error:'user not logged in'});
    return;
  }
  console.log(log.OK + 'LOGOUT: ' + req.session.user + ' logged out');
  req.session.reset();
  res.json({status:"OK"});
};

/***********************/
/* LIST ALL USERS 
/***********************/
exports.list_all_users = function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      console.log(log.ERROR + 'LIST_ALL_USERS: ' + err);
      res.json({status:'error', error: 'fatal'});
      return;
    }
    res.json(users);
  });
};

/***********************/
/* LIST ALL ITEMS 
/***********************/
exports.list_all_items = function(req, res) {
  Item.find({}, function(err, items) {
    if (err) {
      console.log(log.ERROR + 'LIST_ALL_ITEMS: ' + err);
      res.json({status:'error', error: 'fatal'});
      return;
    }
    res.json(items);
  });
};

/***********************/
/* REMOVE ALL USERS 
/***********************/
exports.remove_all_users = function(req, res) {
  User.deleteMany({}, function(err, user) {
    if (err) {
      console.log(log.ERROR + 'REMOVE_ALL_USERS: ' + err);
      res.json({status:'error'});
    } else {
      console.log(log.INFO + 'ALL USERS REMOVED');
      res.json({status:'OK'});
    }  
  });
};

/***********************/
/* REMOVE ALL ITEMS 
/***********************/
exports.remove_all_items = function(req, res) {
  Item.deleteMany({}, function(err, item) {
    if (err) {
      console.log(log.ERROR + 'REMOVE_ALL_ITEMS: ' + err);
      res.json({status:'error', error: 'fatal'});
      return;
    }
    console.log(log.INFO + 'ALL ITEMS REMOVED');
    res.json({status:'OK'});
  });
};