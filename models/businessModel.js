var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,Address = require('../models/addressModel.js');

var businessSchema = new Schema({
	name        : { type: String, required: true },
    address     : [ Address ],
    phone       : { type: String, unique: true },
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

businessSchema.virtual('id')
    .get(function() {
        return this.name;
    });

module.exports = mongoose.model('Business', businessSchema);