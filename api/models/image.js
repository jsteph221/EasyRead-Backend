'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
    image: Buffer
});

module.exports = mongoose.model('Images', ImageSchema);
