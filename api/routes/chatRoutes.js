'use strict'
module.exports = function(app){
    var chatContr = require('../controllers/chatContr');
    app.route('/api/chat/:chatId')
        .get(chatContr.getConversation)
        .post(chatContr.postMessageToConversation);


    app.route('/api/chat')
        .get(chatContr.getUserConversations)
        .post(chatContr.postNewConversation);

};
