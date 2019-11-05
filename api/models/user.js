'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
  followers: {
    type: Array,
  },
});

UserSchema.index( { followers: 'text' } );

module.exports = mongoose.model('Users', UserSchema);
