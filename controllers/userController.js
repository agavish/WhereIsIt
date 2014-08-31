// The User controller
 
var User = require('../models/userModel.js');
var mongoose = require('mongoose');

  /**
   * Creates a new User from the data request
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.createNewUser = function(req, res) {

    console.log('POST - /api/user');

    var user = new User({
      _id: req.body.id,
      firstname: req.body.firstname, 
      lastname: req.body.lastname,
      email: req.body.email,
      username: req.body.username,
      imagePath: req.body.imagePath
    });

    user.save(function(err) {

      if(err) {
        console.log('Error while saving user: ' + err);
        res.send({ error:err });
        return;

      } else {
        console.log("User created");
        return res.send({ status: 'OK', user:user });
      }
    });
  };

  /**
   * Find and retrieves all users
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.findAllUsers = function(req, res) {
    console.log("GET - /api/user");
    return User.find(function(err, users) {
      if(!err) {
        return res.send(users);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Find and retrieves a single user by its username
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.findUserById = function(req, res) {
    console.log("GET - /api/user/:id");

    return User.find({"_id": req.params.id}, function(err, user) {
      if(!user || !user[0]) {
        res.statusCode = 404;
        return res.send({ error: 'User Not found' });
      }

      if(!err) {
        return res.send(user[0]);
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Update a User by its username
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.updateUserById = function(req, res) {

    console.log("PUT - /api/user/:id");

    return User.find({_id: req.params.id}, function(err, user) {

      if(!user || !user[0]) {
        res.statusCode = 404;
        console.log("error: User Not Found");
        return res.send({ error: 'User Not found' });
      }

      if (req.body.firstname != null) user[0].firstname = req.body.firstname;
      if (req.body.lastname != null) user[0].lastname = req.body.lastname;
      if (req.body.password != null) user[0].password = req.body.password;
      if (req.body.favoriteBusinessID != null) addBusinessToFavorites(user[0],req.body.favoriteBusinessID);
      if (req.body.lastVisitedBusinessId != null) addLastVisitedBusiness(user[0],req.body.lastVisitedBusinessId);

      return user[0].save(function(err) {
        if(!err) {
          console.log('User Updated');
          return res.send({ status: 'OK', user:user });
        } else {
          if(err.name == 'ValidationError') {
            res.statusCode = 400;
            res.send({ error: 'Validation error' });
          } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
          }
          console.log('Internal error(%d): %s',res.statusCode,err.message);
        }

        return res.send(user);

      });
    });
  };

    /**
   * Delete a User by its username
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.deleteUser = function(req, res) {

    console.log("DELETE - /api/user/:id");
    
    return User.find({_id: req.params.id}, function(err, user) {
      
      if(!user || !user[0]) {
        res.statusCode = 404;
        console.log("error: User Not Found");
        return res.send({ error: 'User Not found' });
      }

      return user[0].remove(function(err) {
        if(!err) {
          console.log('Removed User');
          return res.send({ status: 'OK' });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          return res.send({ error: 'Server error' });
        }
      })
    });
  };

var addLastVisitedBusiness = function (user,lastVisitedBusinessId) {
  var lastVisitedArray = user.lastVisitedBusiness;

  if (lastVisitedArray.indexOf(lastVisitedBusinessId) == -1) {
    if (lastVisitedArray.length >= 10) {
      lastVisitedArray.shift(); // remove most old visited business
    } 

    var castedBusinessObjectId = mongoose.Types.ObjectId(lastVisitedBusinessId);
    lastVisitedArray.push(castedBusinessObjectId);
  }
};

var addBusinessToFavorites = function (user,id) {
            var businessArray = user.favoriteBusiness;
            if (businessArray.indexOf(id) > -1)
            {
                businessArray.remove(id);
            } else {
                businessArray.push(id);
            }
            user.favoriteBusiness = businessArray

};