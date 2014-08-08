/**
 * User
 *
 * @module      :: Model
 * @description :: Represent data model for the Users
 * @author      :: Adam Gavish
 */
 
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
 
var userSchema = new Schema({
	userName : { type: String, unique: true , required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	password: { type: String, required: true },
	imagePath: String,
	//reviewedBusiness: [ Business ],
	//address: Address,
	//lastVisitedBusiness : [ Business ]
});
 
module.exports = mongoose.model('User', userSchema);