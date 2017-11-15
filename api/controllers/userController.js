'use strict';


var mongoose = require('mongoose'),
  Users = mongoose.model('Users'),
  Exchange = mongoose.model('Exchanges'),
  Image = mongoose.model('Images');
;

exports.getAllUsers = function(req,res){
  Users.find({},function(err,users){
    if (err) {
      console.error(err);
      res.status(500).send(err);
    }
    else{
      res.status(200).json(users);
    }
  });
};
exports.newUser = function(req,res){
  var user = new Users(req.body);
  console.log(user);
  user.save(function(err,user){
    if (err) {
      if(err.code == 11000){
        console.log("User already exists");
        res.status(403).json({message:"Username already in use"});
      }else{
        console.error(err);
        res.status(500).json({message:"Error on server"});
      }
    }
    else{
        console.log("Created new user");
        res.status(200).json({message:"Created new User"});
    }
  });
};

exports.getUser = function(req,res){
  Users.findById(req.params.userName,'_id exchanges',function(err,user){
    if (err)res.send(err);
    if(user){
      res.send(user);
    }else{
        res.status(404).json({message:("User does not exists")});
    }
  });
};
exports.deleteUser = function(req,res){
  Users.findByIdAndRemove(req.params.userName,function(err,user){
    if (err) res.send(err);
    res.status(200).json({message:"Deleted user : "+ user._id});
  });
};

exports.getAllExchanges = function(req,res){
  var userId = req.params.userName;
  Users.findById(userId,'exchanges').populate({path:"exchanges",options:{sort:{'date':-1}}})
      .exec(function (err,exchanges) {
         if(err) res.status(500).send(err);
         res.status(200).send(exchanges);
      });
};
exports.postNewExchange = function(req,res){
  var newExchange = parseJsonToExchangeDocument(req.body);
  var userId = req.params.userName;

  newExchange.save(function(err,exchange){
    if(err) {
      console.log("Error saving exchange: \n"+ err);
      res.send(err);
    }
    else{
      Users.findByIdAndUpdate(userId,{$push:{exchanges:exchange._id}},function(err,user){
        if (err) {
          console.log(err);
          res.status(500).json({message:err.message});
        }else{
          console.log("Added new exchange");
            res.status(200).json({message:"Successfully Added new Exchange"});

        }
      });
    }
  })
};


exports.checkLogin = function(req,res){
  var userId = req.body._id;
  var givenPw = req.body.password;
  var token = req.body.firebaseTokens;
  Users.findById(Object(userId),'password',function(err,user){
    if(err) {
      console.log(err.message);
      res.status(500).json({message:err});
    }
    else{
      if (user == null) {
          res.status(404).json({message: "User does not exist"});
      }
      else if(user.password === givenPw){
        /*
        if(user.firebaseTokens.indexOf(token) == -1){
          user.firebaseTokens.push(token);
          user.save();
        }
        */
        console.log("Login successful");
        res.status(200).json({message:"Login successful"});
      }else{
        console.log("Forbidden Access");
        res.status(403).json({message:"Wrong password"});
      }
    }
  });
}

function parseJsonToExchangeDocument(json){
  var exch = new Exchange();
  exch.book = json.book;
  exch.locationName = json.locationName;
  exch.posterId = json.posterId;
  exch.date = new Date();
  var coords = [];
  coords[0] = json.locationData[0];
  coords[1] = json.locationData[1];
  exch.locationData = coords;
  exch.description = json.description;
  return exch;
}
