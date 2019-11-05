'use strict';
module.exports = function(app) {
var con = require('../controllers/controller');

//GET
app.route('/').get(con.home);
app.route('/item/:id').get(con.item);
app.route('/user/:username').get(con.user);
app.route('/user/:username/posts').get(con.posts);
app.route('/user/:username/followers').get(con.followers);
app.route('/user/:username/following').get(con.following);

//DELETE
app.route('/item/:id').delete(con.delete);

//POST
app.route('/adduser').post(con.adduser);
app.route('/login').post(con.login);
app.route('/logout').post(con.logout);
app.route('/verify').post(con.verify);
app.route('/additem').post(con.additem);
app.route('/search').post(con.search);
app.route('/follow').post(con.follow);

//DEBUGGING
app.route('/listallusers').post(con.listallusers);
app.route('/removeallusers').post(con.removeallusers);
app.route('/listallitems').post(con.listallitems);
app.route('/removeallitems').post(con.removeallitems);
app.route('/reset').post(con.reset);
};
