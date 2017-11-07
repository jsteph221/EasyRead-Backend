'use strict';


var mongoose = require('mongoose'),
  Exchange = mongoose.model('Exchanges');

exports.searchExchanges = function(req,res){
    var limit = 25; //limit to return
    var coords = [];
    coords[0] = req.query.longitude;
    coords[1] = req.query.latitude;
    var maxRadius = req.query.maxDistance; //MsxDistance KM
    var userId = req.query.username;
    Exchange.find({
      locationData:{
        $near:coords,
        $maxDistance:maxRadius
      }, posterId:{$ne:userId}
    }).limit(limit).exec(function(err,exchanges){
      if (err){
        console.log(err);
        return res.status(500).json({message: err.message});
      }else{
        console.log("Search Successful");
        res.status(200).json({exchanges:exchanges,message:"Found Exchanges"});

      }
    });
}

exports.getExchange = function(req,res){
  var id = req.params.exchangeId
  Exchange.findById(id,function(err,exch){
    if(err){
      return res.status(500).send(err);
    }else{
      return res.status(200).send(exch);
    }
  });
}

exports.deleteExchange = function(req,res){
  var id = req.params.id
  Exchange.findByIdAndRemove(id,function(err,removed){
    if(err){
      return res.status(500).send(err);
    }else{
      return res.status(200).send("Removed Exchange");
    }
  });
}
