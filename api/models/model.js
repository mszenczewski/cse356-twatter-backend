'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  key: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

var ItemSchema = new Schema({
  id: {
    type: String,
  },
  username: {
    type: String,
  },
  property: {
    likes: {
      type: String,
    }
  },
  likes: {
    type: Number,
  },
  retweeted: {
    type: Number,
  },
  content: {
    type: String,
  },
  timestamp: {
    type: String,
  },
});

module.exports = mongoose.model('Users', UserSchema);
module.exports = mongoose.model('Items', ItemSchema);
