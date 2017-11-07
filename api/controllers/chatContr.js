'use strict';

var mongoose = require('mongoose'),
    Conversation = mongoose.model('Conversations'),
    Users = mongoose.model("Users"),
    admin = require("firebase-admin");
;

exports.getUserConversations = function(req,res){
    var userId = req.query.userId;

    Users.findById(userId,'conversations').populate('conversations',{topic:1,participants:1,messages:{$slice:-1}})
        .exec(function (err,conversations) {
            if(err) res.status(500).send(err);
            else {
                console.log("Found Conversations for User\n"+ conversations);
                res.status(200).send(conversations);
            }
        });
}

exports.getConversation = function (req,res){
    var chatId = req.params.chatId;
    console.log(chatId);
    var pageNum = req.query.pageNum;    //Page 0 0-25, page 0-24 page 26[50]
    if(pageNum == null){
        pageNum = 0;
    }
    console.log(pageNum);
    var skip = parseInt(pageNum)*25;
    console.log(skip);

    Conversation.findById(chatId,{messages: {$slice:[-skip,25]}},function(err,conversation){
       if (err){
           console.log("Error getting conversation\n"+err)
           res.send(500);
       } else if (conversation == null){
           console.log("ID not found");
           res.status(500).json({message:"Id not found"});
       }else{
           console.log("conversation found");
           res.status(200).json(conversation);
       }
    });
}

exports.postMessageToConversation = function(req,res){
    var newMessage = {
        sentBy: req.body.sentBy,
        data: req.body.message
    }
    var conversationId = req.params.chatId;
    console.log(newMessage);
    console.log(conversationId);
    Conversation.findByIdAndUpdate(conversationId,{$push:{messages:newMessage}},function(err,conv){
       if(err){
           res.status(500).json({message:"Failed"});
           res.send(500);
       } else{
           console.log("Added Message to conversation");
           console.log(conv);
           res.status(200).json({message:"Success"});
           var toUser;
           if(newMessage.sentBy == conv.participants[0]){
             toUser = conv.participants[1];
           }else{
             toUser = conv.participants[0];
           }
           sendToDevice(toUser,newMessage.sentBy,newMessage.data);
       }
    });
}
exports.postNewConversation = function(req,res){
    console.log("Adding new convo");
    var conversation = new Conversation(req.body);
    var fromUser = conversation.messages[0].sentBy;
    var toUser;
    if(fromUser == conversation.participants[0]){
      toUser = conversation.participants[1];
    }else{
      toUser = conversation.participants[0];
    }
    conversation.save(function(err,conv){
        if(err){
            console.log("Error posting new conversation: \n" + err);
            res.send(500);
        }else{
            console.log(conversation.participants);
            Users.updateMany(
                {'_id': {$in:conversation.participants}},
                {$push:{conversations:{$each:[conversation._id],$position:0}}},function(err1,users){
                    if(err1){
                        console.log("Error adding new conversation\n"+err1);
                        res.status(500).json({message:"Failed"});
                        return;
                    }
                    console.log(users);
                    res.status(200).json({message:"Success"});
                    sendToDevice(toUser,fromUser,conversation.messages[0].data)
                }
            );
        }
    });
}
 function sendToDevice(toUser,fromUser,message){
   console.log("Sending notification");
   var payload = {
     data:{
       logged:toUser,
       user:fromUser,
       msg:message
     }
   };
   Users.findById(toUser,'firebaseTokens',function(err,user){
     if(err){
       console.log("error finding to users firebasetokens");
     }else{
       console.log(user);
       admin.messaging().sendToDevice(user.firebaseTokens,payload)
        .then(function(response){
          console.log("Successfully send message");
        })
        .catch(function(error){
          console.log("Error sending message: ",error);
        });
     }
   });

 }
