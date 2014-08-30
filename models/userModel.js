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
  email:                 { type: String, required: true },
  username:              { type: String },
  imagePath:             { type: String },
  reviews:               { type: [ Review.Schema ] },
  favoriteBusiness:      { type: [ Schema.ObjectId ], ref: 'Business' },
  lastVisitedBusiness:   { type: [ Schema.ObjectId ], ref: 'Business' }
});

module.exports = mongoose.model('User', userSchema);

