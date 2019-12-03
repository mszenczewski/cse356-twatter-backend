'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  key: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  followers: {
    type: Array,
    default: []
  },
  following: {
    type: Array,
    default: []
  },
  liked: {
    type: Array,
    default: [] 
  }
}, {shardKey: {username: 1}});

// UserSchema.index( {id: 'username'} );

// UserSchema.index( { email: 'text'} );

module.exports = mongoose.model('Users', UserSchema);