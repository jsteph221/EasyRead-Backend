'use strict'
module.exports = function(app){
  var userContr = require('../controllers/userController');
  app.route('/api/users')
    .get(userContr.getAllUsers)
    .post(userContr.newUser);

  app.route('/api/users/:userName')
    .get(userContr.getUser)
    .delete(userContr.deleteUser);

  app.route('/api/users/:userName/exchanges')
    .get(userContr.getAllExchanges)
    .post(userContr.postNewExchange);

  app.route('/api/users/login')
      .post(userContr.checkLogin);

};
