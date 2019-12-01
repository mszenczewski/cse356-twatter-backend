argv = require('minimist')(process.argv.slice(2));

switch(argv.log) {
  case 'ERROR':
  case 'WARN':
  case 'INFO':
  case 'DEBUG':
    break;
  default:
    console.log('**** INCORRECT LOG LEVEL ****');
    process.exit(1);  
}

console.log(`[args] logging in ${argv.log} mode`);

if (isNaN(argv.port)) {
  console.log('**** INCORRECT PORT ****');
  process.exit(1);  
} else {
  console.log(`[args] listening on port ${argv.port}`);
}

if (!argv.mail || argv.mail.substring(0,8) != '192.168.') {
  console.log('**** INCORRECT MAIL IP ADDRESS ****');
  process.exit(1);  
} else {
  console.log(`[args] using ${argv.mail} as mail server`);
}

const express = require('express');
const app = express();
const session = require('client-sessions');
const bodyParser = require('body-parser');

require('./api/models/item');
require('./api/models/user');
require('./api/models/media');

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

app.listen(argv.port);