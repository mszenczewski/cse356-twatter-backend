'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://192.168.122.56:27017/itemdb', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const ItemSchema = new Schema({
  id: {
    type: String
  },
  username: {
    type: String
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
    type: Number
  },
  parent: {
    type: String
  },
  media: {
    type: Array
  },
  childType: {
    type: String
  }
});

ItemSchema.index( { content: 'text' , id: 'text'} );

module.exports = mongoose.model('Items', ItemSchema);
