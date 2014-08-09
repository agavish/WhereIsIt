// The User controller
 
var User = require('../models/userModel.js');

  /**
   * Creates a new User from the data request
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.createNewUser = function(req, res) {

    console.log('POST - /users');

    var user = new User({
      username : req.body.username,
      firstname: req.body.firstname, 
      lastname : req.body.lastname,
      password : req.body.password,
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
    console.log("GET - /users");
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
    console.log("GET - /users/:id");

    return User.find({id: req.params.id}, function(err, user) {
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

    console.log("PUT - /users/:id");

    return User.find({id: req.params.id}, function(err, user) {

      if(!user || !user[0]) {
        res.statusCode = 404;
        console.log("error: User Not Found");
        return res.send({ error: 'User Not found' });
      }

      if (req.body.firstname != null) user[0].firstname = req.body.firstname;
      if (req.body.lastname != null) user[0].lastname = req.body.lastname;
      if (req.body.password != null) user[0].password = req.body.password;

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

    console.log("DELETE - /users/:id");
    
    return User.find({id: req.params.id}, function(err, user) {
      
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