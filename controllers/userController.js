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


exports.findFavoriteBusinessesByUserId = function(req,res) {
    console.log("GET - /users/favorite-businesses/:id");

    return User
        .findOne({"_id": req.params.id})
        .populate('favoriteBusinesses')
        .exec( function (err,user) {
            if(!user || !user.favoriteBusinesses) {
                res.statusCode = 404;
                return res.send({ error: 'Reviews Not found' });
            }

            if(!err) {
                return res.send(user.favoriteBusinesses);
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
};

exports.findLastVisitedBusinessesByUserId = function(req,res) {
    console.log("GET - /users/last-visited-businesses/:id");

    return User
        .findOne({"_id": req.params.id})
        .populate('lastVisitedBusinesses')
        .exec( function (err,user) {
            if(!user || !user.lastVisitedBusinesses) {
                res.statusCode = 404;
                return res.send({ error: 'User last businesses not found' });
            }

            if(!err) {
                return res.send(user.lastVisitedBusinesses);
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
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
    console.log("GET - /api/user/");

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

    console.log("PUT - /api/user/");
    if (!req.user) {
      res.statusCode = 401;
      console.log('User not logged in, unauthorized',res.statusCode);
      return res.send({ error: 'User not logged in, unauthorized' });
    }
    if (req.user._doc._id != req.params.id) {
      res.statusCode = 403;
      console.log('User id does not match session user id, permission denied',res.statusCode);
      return res.send({ error: 'User id does not match session user id, permission denied' });
    }

    return User.findOne({_id: req.params.id}, function(err, user) {

      if(!user) {
        res.statusCode = 404;
        console.log("error: User Not Found");
        return res.send({ error: 'User Not found' });
      }

      if (req.body.firstname != null) user.firstname = req.body.firstname;
      if (req.body.lastname != null) user.lastname = req.body.lastname;
      if (req.body.password != null) user.password = req.body.password;
      if (req.body.favoriteBusinessId != null) addBusinessToFavorites(user,req.body.favoriteBusinessId);
      if (req.body.lastVisitedBusinessId != null) addLastVisitedBusiness(user,req.body.lastVisitedBusinessId);

      return user.save(function(err) {
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
    
    if (!req.user) {
      res.statusCode = 401;
      console.log('User not logged in, unauthorized',res.statusCode);
      return res.send({ error: 'User not logged in, unauthorized' });
    }

    if (req.user._doc._id != req.params.id) {
      res.statusCode = 403;
      console.log('User id does not match session user id, permission denied',res.statusCode);
      return res.send({ error: 'User id does not match session user id, permission denied' });
    }
    
    return User.findOne({_id: req.params.id}, function(err, user) {
      
      if(!user) {
        res.statusCode = 404;
        console.log("error: User Not Found");
        return res.send({ error: 'User Not found' });
      }

      var userToRemoveId = user._id;
      return user.remove(function(err) {
        if(!err) {
            //remove all reviews of this user from db



            //remove all reviews of this user from business
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
  var lastVisitedArray = user.lastVisitedBusinesses;

  // if the business is already in the last visited businesses, do nothing
  if (lastVisitedArray && lastVisitedArray.indexOf(lastVisitedBusinessId) > -1) {
    console.log('User update with last visited business: No action. businessId ' + lastVisitedBusinessId + ' already in lastVisitedBusinesses');
    return;
  }

  // validate there are no more than 9 businesses in the array (make room for a new business)
  while (lastVisitedArray.length >= 10) {
    lastVisitedArray.shift();
  }

  // insert a new business
  var castedBusinessObjectId = mongoose.Types.ObjectId(lastVisitedBusinessId);
  lastVisitedArray.push(castedBusinessObjectId);

  user.lastVisitedBusinesses = lastVisitedArray;
  user.save(function(err) {
    if(err) {
      console.log('Error while updating user: ' + err);

    } else {
      console.log("User updated with last visited business: " + castedBusinessObjectId);
    }
  });
};

exports.updateUserLastVisitedBusiness = function(userId, businessId) {
  var user = User.findOne({"_id": userId}, function (err, user) {
    if (err || !user) {
      return null;
    } else {
      addLastVisitedBusiness(user, businessId);
    }
  });
};

var addBusinessToFavorites = function (user, businessId) {
  var businessesArray = user.favoriteBusinesses;
  if (businessesArray.indexOf(businessId) > -1) {
    businessesArray.remove(businessId);
  } else {
    businessesArray.push(businessId);
  }
  user.favoriteBusinesses = businessesArray;
};