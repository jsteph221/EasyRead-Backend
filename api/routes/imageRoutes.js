'use strict'
module.exports = function(app){
  var imgContr = require('../controllers/imageController.js');
  app.route('/api/image/:imageId')
    .get(imgContr.getImage);
  app.route('/api/image')
    .post(imgContr.postImage);
  };
