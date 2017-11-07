'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExchangeSchema = new Schema({
    book:[{
        _id:false,
        title:String,
        author:String,
        imageUrl:String,
    }],
    posterId:{type: String, ref:'Users'},
    date:Date,
    locationData:{
        type:[Number],//longitude,latitude
        index:'2d'
    },
    locationName:String,
    description:String
});

module.exports = mongoose.model('Exchanges', ExchangeSchema);
