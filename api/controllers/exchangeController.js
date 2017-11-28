'use strict';


var mongoose = require('mongoose'),
  Exchange = mongoose.model('Exchanges'),
  User = mongoose.model('Users');

exports.searchExchanges = function(req,res){
    var limit = 25; //limit to return
    var coords = [];
    coords[0] = req.query.longitude;
    coords[1] = req.query.latitude;

    var maxRadius = req.query.maxDistance; //MsxDistance KM

    var userId = req.query.username;

    var query = Exchange.where('locationData').near({center:coords,maxDistance:maxRadius});

    if(userId != null){
      query.where('posterId').ne(userId);
    }
    if(req.query.search != null){
      var searchWords = req.query.search;
      searchWords.replace(/\+/g," ");
      query.where({$text:{$search:searchWords}}).select({score:{$meta:"textScore"}});
    }
    var sort = req.query.sort;

    if(sort != null){
      if(sort == "relevance"){
        query.sort({score:{$meta:"textScore"}});
      }else if(sort =="date"){
        query.sort("date");
      }else if(sort == "nearest"){
        //Do nothing since will automatically sort by nearest
      }
    }else{
      //Default to sorting by date if no sort query supplied
      query.sort("date");
    }

    query.limit(limit).exec(function(err,exchanges){
      if (err){
        console.log(err);
        return res.status(500).json({message: err.message});
      }else{
        console.log("Search Successful");
        res.status(200).json({exchanges:exchanges,message:"Found Exchanges"});
      }});


    /*
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
    */
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

exports.editExchange = function(req,res){
  var id = req.params.exchangeId
  var body = req.body;
  Exchange.findById(id,function(err,exch){
    if(err){
      return res.status(500).send(err);
    }else{
      exch.book = body.book;
      exch.date = new Date();
      exch.locationData = body.locationData;
      exch.locationName = body.locationName;
      exch.description = body.description;
      exch.save(function(err,exch){
        if(err) return res.status(500).send(err);
        res.status(200).json({message:"Success"});
      });
    }
  });
}

exports.deleteExchange = function(req,res){
  var id = req.params.exchangeId;
  Exchange.findByIdAndRemove(id,function(err,removed){
    if(err){
      consle.log("Error removing exchange");
      return res.status(500).send(err);
    }else{
      console.log(removed);
      User.update({_id:removed.poster},{$pull:{exchanges:id}},function(err,updated){
        if(err){
          console.log("Error removing exchange from user");
          return res.status(500).send(err);
        }else{
          console.log("Deleted from user");
          return res.status(200).send({message:"Removed Exchange"});
        }
      });

    }
  });
}
