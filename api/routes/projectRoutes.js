'use strict';
module.exports = function(app) {
  var con = require('../controllers/projectController');

  //GET
  app.route('/item/:id').get(con.item);

  //POST
  app.route('/adduser').post(con.add_user);
  app.route('/login').post(con.login);
  app.route('/logout').post(con.logout);
  app.route('/verify').post(con.verify);
  app.route('/additem').post(con.additem);
  app.route('/search').post(con.search);

  //DEBUGGING
  app.route('/list_all_users').post(con.list_all_users);
  app.route('/remove_all_users').post(con.remove_all_users);
  app.route('/list_all_items').post(con.list_all_items);
  app.route('/remove_all_items').post(con.remove_all_items);
};
