const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('client-sessions');
const bodyParser = require('body-parser');

require('./api/models/user');
require('./api/models/item');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/twatterdb', {useNewUrlParser: true, useUnifiedTopology: true}); 
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  cookieName: 'session',
  secret: 'ax86nsob7jeu48gks',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

const routes = require('./api/routes/routes'); 
routes(app);

app.listen(8080);
