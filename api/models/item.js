'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
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

ItemSchema.index( { content: 'text' } );

module.exports = mongoose.model('Items', ItemSchema);
