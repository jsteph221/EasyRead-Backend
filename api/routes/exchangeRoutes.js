'use strict'
module.exports = function(app){
  var exchageContr = require('../controllers/exchangeController');

  //Body
  app.route('/api/exchanges')
    .get(exchageContr.searchExchanges);


  app.route('/api/exchanges/:exchangeId')
    .get(exchageContr.getExchange)
    .delete(exchageContr.deleteExchange);
};
