'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = new Schema({
  id: {
    type: String,
    index: true
  },
  by: {
    username: {
      type: String
    },
    tweetid: {
      type: String,
    }
  },
  content: {
    contentType: String,
    data: Buffer
  },
});

MediaSchema.index( {id: 'text'} );

module.exports = mongoose.model('Media', MediaSchema);