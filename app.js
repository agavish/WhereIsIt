
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , bodyParser = require('body-parser');

mongoose.connect('mongodb://Admin:Admin@kahana.mongohq.com:10075/WhereIsIt', function(err, res) {
  if(err) {
    console.log('error connecting to MongoDB Database. ' + err);
  } else {
    console.log('Connected to Database' + res);
  }
});

var app = express();

// all environment
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.use(bodyParser.json());
app.engine('html', require('ejs').renderFile); // ' avi 8.8

// set up the RESTful API, handler methods are defined in controllers
var userController = require('./controllers/userController.js');

app.get('/users', userController.findAllUsers);
app.get('/users/:username', userController.findUserById);
app.put('/users/:username', userController.updateUserById);
app.post('/users', userController.createNewUser);
app.delete('/users/:username', userController.deleteUser);

var businessController = require('./controllers/businessController.js');

app.get('/business', businessController.findAllBusinesses);
app.get('/business/:name?', businessController.findBusinessById);
app.put('/business/:name', businessController.updateBusinessById);
app.post('/business', businessController.createNewBusiness);
app.delete('/business/:name', businessController.deleteBusiness);


app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
