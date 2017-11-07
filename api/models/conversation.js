'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationSchema = new Schema({
    participants:[String],
    topic:String,
    messages:[{
        _id:false,
        sentBy:String,
        data:String
    }]
});

module.exports = mongoose.model('Conversations', ConversationSchema);