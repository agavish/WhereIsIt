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
	username : { type: String, unique: true , required: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	password: { type: String, required: true },
	imagePath: String,
	//reviewedBusiness: [ Business ],
	//address: Address,
	//lastVisitedBusiness : [ Business ]
});

userSchema.virtual('id')
	.get(function() {
		return this.username;
	});

module.exports = mongoose.model('User', userSchema);

