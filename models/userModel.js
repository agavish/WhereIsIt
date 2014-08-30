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
	_id: { type: String, required: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	username : { type: String },
	imagePath: String,
	reviews: [ Review.schema ],
	lastVisitedBusiness : [ Business.schema ]
});

module.exports = mongoose.model('User', userSchema);

