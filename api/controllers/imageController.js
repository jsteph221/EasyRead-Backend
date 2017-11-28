'use strict';


var mongoose = require('mongoose'),
  Image = mongoose.model('Images');

exports.getImage = function(req,res){
    var imgId = req.params.imageId;
    Image.findById(imgId,function(err,img){
      if(err) return res.status(404).send(err);
      res.status(200).send(img.image);
    });

}

exports.postImage = function(req,res){
  var newImage = new Image();
  const buffer = Buffer.from(req.body.base64Image,'base64');
  newImage.image= buffer;
  newImage.save(function(err,img){
    if(err) {
      console.log("ERROR SAVING IMAGE");
      return res.status(200).send(err);
    }
    console.log("IMAGE SAVED");
    res.status(200).send({imageId:img._id});
  });
}
