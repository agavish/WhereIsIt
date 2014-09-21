/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/index')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , bodyParser = require('body-parser')
  , session = require('cookie-session')
  , passport = require('passport')
  , facebookAuthService = require('./services/facebookAuthService.js')
  , docs = require("express-mongoose-docs");

// dev: mongodb://Admin:Admin@kahana.mongohq.com:10075/WhereIsIt
// prod (mta cluster): localhost:27017/WhereIsIt
mongoose.connect('mongodb://Admin:Admin@kahana.mongohq.com:10075/WhereIsIt', function(err, res) {
  if(err) {
    console.log('error connecting to MongoDB Database. ' + err);
  } else {
    console.log('Connected to Database ' + res);
  }
});

var app = express();

// all environment
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile); // ' avi 8.8
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'keyboard cat',
    maxage : 1000*60*60
  })
);
// set up passport for authentication
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

// auto generate api documentation
docs(app, mongoose);



http.createServer(app).listen(app.get('port'), function () {
    var splash = function () {/*
 _    _  _  _  ___  ___   ___    __  ___    __  ____ 
( \/\/ )( )( )(  _)(  ,) (  _)  (  )/ __)  (  )(_  _)
 \    /  )__(  ) _) )  \  ) _)   )( \__ \   )(   )(  
  \/\/  (_)(_)(___)(_)\_)(___)  (__)(___/  (__) (__)                                                 
                                                  
         */};
    console.log(splash.toString().match(/\/\*([\s\S]*)\*\//m)[1]);
      console.log("listening on port " + app.get('port'));
  });