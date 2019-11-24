'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = new Schema({
  id: {
    type: String
  },
  by: {
    username: {
      type: String
    },
    tweetid: {
      type: String
    }
  },
  path: {
    type: String
  },
  filetype: {
    type: String
  }
});

MediaSchema.index( {id: 'text'} );

module.exports = mongoose.model('Media', MediaSchema);
