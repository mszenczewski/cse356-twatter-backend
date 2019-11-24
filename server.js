args = process.argv.slice(2);

switch(args[0]) {
  case 'error':
  case 'warn':
  case 'info':
  case 'debug':
    break;
  default:
    console.log('**** DID NOT SET DEBUG LEVEL ****');
    process.exit(1);  
}

console.log(`[args] logging in ${args[0]} mode`);
args[0] = args[0].toUpperCase();

if (isNaN(args[1])) {
  console.log('**** FAILED TO SET PORT ****');
  process.exit(1);  
} else {
  console.log(`[args] listening on port ${args[1]}`);
}

if (!args[2] || args[2].substring(0,8) != '192.168.') {
  console.log('**** DID NOT SET MONGODB IP ADDRESS ****');
  process.exit(1);  
} else {
  console.log(`[args] using ${args[2]} as mongo server`);
}

if (!args[3] || args[3].substring(0,8) != '192.168.') {
  console.log('**** DID NOT SET MAIL IP ADDRESS ****');
  process.exit(1);  
} else {
  console.log(`[args] using ${args[2]} as mail server`);
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('client-sessions');
const bodyParser = require('body-parser');

require('./api/models/user');
require('./api/models/item');
require('./api/models/media');

mongoose.Promise = global.Promise;
const mongo_url = `mongodb://${args[2]}:27017/twatterdb`;
mongoose.connect(mongo_url, {useNewUrlParser: true, useUnifiedTopology: true}); 

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  cookieName: 'session',
  secret: 'ax86nsob7jeu48gks',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

const routes = require('./api/routes'); 
routes(app);

app.listen(args[1]);