'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    _id: String,
    password:{type:String,required:true},
    exchanges:[{ type : Schema.ObjectId, ref: 'Exchanges' }],
    firebaseTokens:[String],
    conversations:[{type: Schema.ObjectId, ref:'Conversations'}],    //wishlist:[mongoose.ObjectId]
});

module.exports = mongoose.model('Users', UserSchema);
