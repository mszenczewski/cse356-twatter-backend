'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://192.168.122.55:27017/mediadb', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const MediaSchema = new Schema({
  id: {
    type: String,
  },
  by: {
    username: {
      type: String,
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