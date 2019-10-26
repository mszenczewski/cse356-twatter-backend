var express = require('express');
  app = express();
  mongoose = require('mongoose');
  session = require('client-sessions');
  User = require('./api/models/user');
  Item = require('./api/models/item');
  bodyParser = require('body-parser');

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

var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route

app.listen(8080);
