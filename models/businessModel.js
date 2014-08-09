var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,Branch = require('../models/branchModel.js')
   ,Address = require('../models/addressModel.js');

var businessSchema = new Schema({
	name        : { type: String, required: true },
    branch      : [{
        address    : [{
            city       : String,
            street     : String,
            homeNumber : Number            
        }],
        phone      : String,
    }],
    email       : String,
    imagePath   : String,
    numOfScores : Number,
    score       : Number,
    businessType: { type: String, required: true },
    description : String,
    startHour   : Date,
    endHour     : Date,
    openDays    : [ Date ],
    website     : String,
    additionalInfo : { },
    //reviews     : [ Review ],
});

module.exports = mongoose.model('Business', businessSchema);