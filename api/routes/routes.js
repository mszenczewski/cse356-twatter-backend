'use strict';
module.exports = function(app) {
  var con = require('../controllers/controller');

  //GET
  app.route('/item/:id').get(con.item);
  app.route('/').get(con.home);

  //POST
  app.route('/adduser').post(con.adduser);
  app.route('/login').post(con.login);
  app.route('/logout').post(con.logout);
  app.route('/verify').post(con.verify);
  app.route('/additem').post(con.additem);
  app.route('/search').post(con.search);

  //DEBUGGING
  app.route('/listallusers').post(con.listallusers);
  app.route('/removeallusers').post(con.removeallusers);
  app.route('/listallitems').post(con.listallitems);
  app.route('/removeallitems').post(con.removeallitems);
};
