'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  id: {
    type: String
  },
  username: {
    type: String,
    index: true
  },
  property: {
    likes: {
      type: Number
    }
  },
  retweeted: {
    type: Number
  },
  content: {
    type: String
  },
  timestamp: {
    type: String
  },
  parent: {
    type: String
  },
  media: {
    type: Array
  }
});

ItemSchema.index( { content: 'text' , id: 'text'} );

module.exports = mongoose.model('Items', ItemSchema);