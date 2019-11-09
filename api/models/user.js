'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
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
});

UserSchema.index( { followers: 'text' } );

module.exports = mongoose.model('Users', UserSchema);
