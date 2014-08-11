// The Review controller
 
var Review = require('../models/reviewModel.js');
var User = require('../models/userModel.js');
var Business = require('../models/businessModel.js');

  /**
   * Creates a new Review from the data request
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.createNewReview = function(req, res) {

    console.log('POST - /review');
    var errors = [];

    var userId = req.body.userId;
    var businessId = req.body.businessId;

    // validate the user exists
    User.findOne({ "_id": userId }, function (err, user) {
      if (err) {
        var errorMsg = "Could not add the review. No user found with id: " + userId;
        console.log(errorMsg);
        errors.push(errorMsg);        
      }
    });

    // validate the business exists
    User.findOne({ "_id": businessId }, function (err, business) {
      if (err) {
        var errorMsg = "Could not add the review. No business found with id: " + businessId;
        console.log(errorMsg);
        errors.push(errorMsg);        
      }
    });    

    if (errors.length > 0) {
      console.log('Error while saving review');
      res.send({ errors:errors });
      return;
    }

    var reviewModel = new Review();
    reviewModel.userId = userId;
    reviewModel.businessId = businessId;
    reviewModel.content = req.body.content;
    reviewModel.date = new Date();
    reviewModel.save(function(err) {

      if(err) {
        console.log('Error while saving review: ' + err);
        res.send({ error:err });
        return;

      } else {
        console.log("Review created");
        return res.send(reviewModel);
      }
    });
  };

  /**
   * Find and retrieves a single review by its id
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  exports.findReviewById = function(req, res) {
    console.log("GET - /business/:id");
    return Review.find({_id: req.params.id}, function(err, review) {
      if(!review || !review[0]) {
        res.statusCode = 404;
        return res.send({ error: 'Review Not found' });
      }

      if(!err) {
        return res.send(review[0]);
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Find and retrieves all reviews by userId.
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  exports.findReviewsByUserId = function(req, res) {
    console.log("GET - /review/user/:userId");
    return Review.find({userId: req.params.userId}, function(err, reviews) {
      if(!reviews || !reviews[0]) {
        res.statusCode = 404;
        return res.send({ error: 'Reviews Not found' });
      }

      if(!err) {
        return res.send(reviews);
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Find and retrieves all reviews by businessId.
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  exports.findReviewsByBusinessId = function(req, res) {
    console.log("GET - /review/business/:businessId");
    return Review.find({businessId: req.params.businessId}, function(err, reviews) {
      if(!reviews || !reviews[0]) {
        res.statusCode = 404;
        return res.send({ error: 'Reviews Not found' });
      }

      if(!err) {
        return res.send(reviews);
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };


  /**
   * Delete a Review by its id
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  exports.deleteReview = function(req, res) {

    console.log("DELETE - /review/:id");
    
    return Review.find({_id: req.params.id}, function(err, review) {
      if(!review || !review[0]) {
        res.statusCode = 404;
        console.log("error: Review Not Found");
        return res.send({ error: 'Review Not found' });
      }

      return review[0].remove(function(err) {
        if(!err) {
          console.log('Removed Review');
          return res.send({ status: 'OK' });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          return res.send({ error: 'Server error' });
        }
      })
    });
  };