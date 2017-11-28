var bodyParser = require('body-parser');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose= require('mongoose')
;

var User = require('./api/models/user.js');
var Exchange = require('./api/models/exchange.js');
var Conversation = require('./api/models/conversation.js');
var Image = require('./api/models/image.js')

var uri = 'mongodb://localhost/easyRead'
mongoose.Promise = global.Promise;
mongoose.connect(uri);

var admin = require("firebase-admin");
var serviceAccount = require("./api/config/easyread-182422-firebase-adminsdk-s54dw-c2dbf883c9.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://easyread-182422.firebaseio.com"
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var userRoutes = require('./api/routes/userRoutes');
var exchangeRoutes = require('./api/routes/exchangeRoutes');
var chatRoutes = require('./api/routes/chatRoutes');
var imageRoutes = require('./api/routes/imageRoutes');

var listener = app.listen(port);

//Set cors
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", '*');
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(function(req,res,next){
    console.log("REQUEST: "+req.method +" : "+ req.originalUrl);
    next();
});

userRoutes(app);
exchangeRoutes(app);
chatRoutes(app);
imageRoutes(app);
app.use(function logErrors(err,req,res,ext){
    if (res.headersSent){
        return next(err);
    }
    res.status(500).send(err.message);
});

console.log('Listening on : '+listener.address().port);
