'use strict';

var nodemailer = require('nodemailer');
const path = require("path");

var mongoose = require('mongoose'),
  User = mongoose.model('Users'),
  Item = mongoose.model('Items');

exports.home = function(req, res) {
  res.redirect('home');
}

/***********************/
/* ADD USER 
/* { username:, password:, email: }
/***********************/
exports.add_user = function(req, res) {
  console.log('ADD USER: ' + JSON.stringify(req.body, null, 2));

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

  transporter.sendMail(mail_options, function(error, info){
    if (error) {
      console.log(error);
    } else {
      let tmp = info.response.split(' ');
      let code = tmp[2];
      console.log('email sent: ' + mail_options.to + ' [' + code + ']');
    }
  });

  new_user.save(function(err, user) {
    if (err) res.send(err);
    res.json({status:"OK"});
  });
};

/***********************/
/* LOGIN 
/* { username:, password: }
/***********************/
exports.login = function(req, res) {
  User.findOne(
    { 'username': req.body.username, 'password': req.body.password, 'verified': true },
    function(err, user) {
      if (user === null) {
        res.json({status: "error"});
      } else {
        console.log('user logged in: ' + user.username);
        req.session.user = user.username;
        res.json({status: "OK"});
      }
    });
};

/***********************/
/* VERIFY USER 
/* { email:, key: }
/***********************/
exports.verify = function(req, res) {
  if (req.body.key === "abracadabra") {
    User.findOneAndUpdate(
      {email: req.body.email}, 
      {$set:{verified:true}},
      function(err, user) {
        if(err){
          console.log('abracadabra error: ' + err);
          res.json({status:"error"});
        }
        console.log('email verified: ' + req.body.email);
        res.json({status:"OK"});
      }
    );
    return;
  }

  User.findOne(
    {email: req.body.email}, 
    function(err, user) {
      if (err) console.log('verify error: ' + err);
      if(user.key != req.body.key){
        res.json({status:"error"});
        return;
      }

      User.findOneAndUpdate(
        {email: req.body.email}, 
        {$set:{verified:true}},
        function(err, user) {
          if(err){
            console.log('verify error: ' + err);
            res.json({status:"error"});
          }
          console.log('email verified: ' + user.email);
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
  if (!req.session || !req.session.user || !req.body.content) { 
    res.json({status: "error"});
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
    if (err) console.log("additem: " + err);
    console.log("item added: " + item.id);
    res.json({status:'OK', id: item.id});
  });
};

/***********************/
/* ITEM
/***********************/
exports.item = function(req, res) {
  console.log('id requested: ' + req.params.id);
  Item.findOne(
    { 'id': req.params.id},
    function(err, item) {
      if (err) console.log('item: ' + err);
      if (item === null) {
        res.json({status: "error"});
        return;
      } else {
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
        res.send(json);
      }
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

  console.log('search query: ' + req.body.timestamp + ' ' + req.body.limit + ', using: ' + timestamp + ' ' + limit);

  Item.find({timestamp: {$lte: timestamp}}, 
    function(err, results) {
      if (err) console.log('search err: ' + err);

      let json = {
        status:'OK',
        items: results,
      };
    
      res.send(json);
    }).limit(limit);
};

/***********************/
/* LOGOUT
/* {content:, childType: } 
/***********************/
exports.logout = function(req, res) {
  req.session.reset();
  res.json({status:"OK"});
};

/***********************/
/* LIST ALL USERS 
/***********************/
exports.list_all_users = function(req, res) {
  User.find({}, function(err, user) {
    if (err) console.log("list_all_users: " + err);
    res.json(user);
  });
};

/***********************/
/* REMOVE ALL USERS 
/***********************/
exports.remove_all_users = function(req, res) {
  User.deleteMany({}, function(err, user) {
    if (err) {
      console.log('remove_all_users: ' + err);
      res.json({status:'error'});
    } else {
      console.log('all users removed');
      res.json({status:'OK'});
    }  
  });
};

/***********************/
/* LIST ALL ITEMS 
/***********************/
exports.list_all_items = function(req, res) {
  Item.find({}, function(err, item) {
    if (err) console.log("list_all_items: " + err);
    res.json(item);
  });
};

/***********************/
/* REMOVE ALL ITEMS 
/***********************/
exports.remove_all_items = function(req, res) {
  Item.deleteMany({}, function(err, item) {
    if (err) {
      console.log('remove_all_items: ' + err);
      res.json({status:'error'});
    } else {
      console.log('all items removed');
      res.json({status:'OK'});
    }
  });
};