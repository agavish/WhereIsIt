/**
 * User
 *
 * @module      :: Model
 * @description :: Represent data model for the Users
 * @author      :: Adam Gavish
 */

var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
var Review = require('mongoose').model('Review');
var Business = require('mongoose').model('Business');
 
var userSchema = new Schema({
  // we identify users by their facebook id which is of type string
  _id:                   { type: String, required: true },
  firstname:             { type: String, required: true },
  lastname:              { type: String, required: true },
  email:                 { type: String },
  username:              { type: String },
  imagePath:             { type: String },
  reviews:               { type: [ Review.Schema ] },
  favoriteBusinesses:    [ { type:  Schema.ObjectId , ref: 'Business' } ],
  lastVisitedBusinesses: [ { type:  Schema.ObjectId , ref: 'Business' } ]
});

userSchema.statics.deleteReviewById = function (userId,reviewToRemove,callback) {
    this.findOne({"_id": userId}, function (err, user) {
        if (err) {
            callback(user, err,404);
        } else if (!user) {
            callback(user, err);
        } else if (user) {
            var index = user.reviews.indexOf(reviewToRemove);
            //The second parameter of splice is the number of elements to remove
            user.reviews.splice(index, 1);
            user.save(function (err) {
                callback(user, err);
            });
        }
    });
};


module.exports = mongoose.model('User', userSchema);

