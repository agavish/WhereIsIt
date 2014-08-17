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
  , facebookAuthService = require('./services/facebookAuthService.js');

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
app.set('views', __dirname + '/views');
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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});