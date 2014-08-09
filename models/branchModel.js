var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,Address = require('../models/addressModel.js');

// Branch
var branchSchema = new Schema({
	address    : [ {
	    city       : String,
	    street     : String,
    	homeNumber : Number
	} ],
    phone      : String,
});

module.exports = mongoose.model('Branch', branchSchema);