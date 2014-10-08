// The Review controller

var mongoose = require('mongoose');
var Review = require('../models/reviewModel.js');
var Business = require('../models/businessModel.js');
var User = require('../models/userModel.js');

/**
 * Creates a new Review from the data request
 * @param {Object} req HTTP request object.
 * @param {Object} res HTTP response object.
 */
exports.createNewReview = function(req, res) {

    console.log('POST - /review');

    if (!req.user) {
        res.statusCode = 403;
        console.log('User not logged in, unauthorized',res.statusCode);
        return res.send({ error: 'User not logged in, unauthorized' });
    }

    var errors = [];
    var userId = req.params.userId;
    var businessId = req.params.businessId;
    var content = req.body.review;

    // validate the user exists
    var user = User.findOne({ "_id": userId }, function (err, user) {
        if (err) {
            var errorMsg = "Could not add the review. No user found with id: " + userId;
            console.log(errorMsg);
            errors.push(errorMsg);
        }
        if (user) {
            // validate the business exists

            var business = Business.findOne({ "_id": businessId }, function (err, business) {
                if (err) {
                    var errorMsg = "Could not add the review. No business found with id: " + businessId;
                    console.log(errorMsg);
                    errors.push(errorMsg);
                }

                if (business) {
                    // save the new review
                    var reviewModel = new Review();
                    reviewModel.userId = userId;
                    reviewModel.businessId = mongoose.Types.ObjectId(businessId);
                    reviewModel.content = content;
                    reviewModel.date = new Date();
                    reviewModel.save(function(err) {

                        if(err) {
                            console.log('Error while saving review: ' + err);
                            res.send({ error:err });


                        } else {
                            // update the user which created the review with the review
                            User.update({"_id": userId}, {$push: { reviews: reviewModel } }, function(err) {
                                if (err) {
                                    var errorMsg = "Could not add the review to the user " + userId;
                                    console.log(errorMsg);
                                    errors.push(errorMsg);
                                }
                            });

                            // update the business which was reviewed with the review
                            Business.update({"_id": businessId}, {$push: { reviews: reviewModel._id } }, function(err) {
                                if (err) {
                                    var errorMsg = "Could not add the review to the business " + businessId;
                                    console.log(errorMsg);
                                    errors.push(errorMsg);
                                }
                            });

                            // validate no errors and send the review as response
                            if (errors.length > 0) {
                                console.log('Error while saving review');
                                res.send({ errors:errors });

                            } else {
                                console.log("Review created");
                                return res.send(reviewModel);
                            }
                        }
                    });
                }
            });
        }});
};

/**
 * Find and retrieves a single review by its id
 * @param {Object} req HTTP request object.
 * @param {Object} res HTTP response object.
 */
exports.findReviewById = function(req, res) {
    console.log("GET - /review/:id");
    return Review.find({"_id": req.params.id}, function(err, review) {
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

    return Review.find({"userId": req.params.userId}, function(err, reviews) {
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

    return Business
    .findOne({"_id": req.params.businessId})
    .populate('reviews')
    .exec(function (err, business) {
        if(!business || !business.reviews) {
            res.statusCode = 404;
            return res.send({ error: 'Reviews Not found' });
        }

        if (!err) {
          Review.populate(business.reviews, {path:'userId'}, function(err, reviews) {
            if (!err) {
              return res.send(reviews);
            }
          });     
        }
        if (err) {
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

    var userid ;
    var businessid ;
    var reviewToRemove;

    var deleteReivewFromUserCallBackFunction = function (user, err, status) {
        if (err) { //  unable to remove from for some reason
            console.log(err);
            res.result = status;
            res.send({error: 'Failed to remove review from user'})

        } else if (user) { // we have a user - > delete from business
            Business.deleteReviewById(businessid, reviewToRemove._id, deleteReviewFromBusinessCallBackFunction);

        } else if (!user) { // in case this review was written by user that was removed - > delete from business

            Business.deleteReviewById(businessid, reviewToRemove._id, deleteReviewFromBusinessCallBackFunction);
        }
    };

    var deleteReviewFromBusinessCallBackFunction = function (err, status) {
        if (err) {
            switch (status) {
                case 404:
                    console.log(err);
                    res.result = status;
                    res.send({error: 'Failed to remove review from business'});
                    break;
                case 500:
                    res.statusCode = status;
                    console.log('Failed to update user (remove review)', res.statusCode, err.message);
                    return res.send({ error: 'Server error' });
                    break;
            }
        } else {
            console.log('Removed Review');
            res.statusCode = 200;
            return res.send({ status: 'OK' });
        }
    };

    console.log("DELETE - /review/:id");
    if (!req.user) {
        res.statusCode = 401;
        console.log('User not logged in, unauthorized', res.statusCode);
        return res.send({ error: 'User not logged in, unauthorized' });
    }

    return Review.findOne({"_id": req.params.id}, function (err, review) {
        if (!review) {
            res.statusCode = 404;
            console.log("error: Review Not Found");
            return res.send({ error: 'Review Not found' });
        }

        if (req.user._doc._id != review.userId) {
            res.statusCode = 403;
            console.log('Session user id does not match the review user id, permission denied', res.statusCode);
            return res.send({ error: 'Session user id does not match the review user id, permission denied' });
        }

        // we save this parameters before we delete the review
        userid = review.userId;
        businessid = review.businessId;
        reviewToRemove = review;

        return review.remove(function (err) {
            if (!err) {
                //remove embedded review from user
                User.deleteReviewById(userid, reviewToRemove,deleteReivewFromUserCallBackFunction);

            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });
}

