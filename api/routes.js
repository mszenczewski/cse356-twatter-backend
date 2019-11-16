'use strict';
module.exports = function(app) {
    //GET
    app.route('/').get(require('./controllers/home'));
    app.route('/item/:id').get(require('./controllers/item'));
    app.route('/user/:username').get(require('./controllers/user'));
    app.route('/user/:username/posts').get(require('./controllers/posts'));
    app.route('/user/:username/followers').get(require('./controllers/followers'));
    app.route('/user/:username/following').get(require('./controllers/following'));

    //DELETE
    app.route('/item/:id').delete(require('./controllers/delete'));

    //POST
    app.route('/adduser').post(require('./controllers/adduser'));
    app.route('/additem').post(require('./controllers/additem'));
    app.route('/login').post(require('./controllers/login'));
    app.route('/logout').post(require('./controllers/logout'));
    app.route('/verify').post(require('./controllers/verify'));
    app.route('/search').post(require('./controllers/search'));
    app.route('/follow').post(require('./controllers/follow'));
    app.route('/loggedin').post(require('./controllers/loggedin'));

    //DEBUGGING
    const debug = require('./controllers/debug');
    app.route('/listallusers').post(debug.listallusers);
    app.route('/removeallusers').post(debug.removeallusers);
    app.route('/listallitems').post(debug.listallitems);
    app.route('/removeallitems').post(debug.removeallitems);
    app.route('/reset').post(debug.reset);
};
