var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,Address = require('../models/addressModel.js');

var businessSchema = new Schema({
  name        : { type: String, required: true },
  address     : { 
    city       : String,
    street     : String,
    homeNumber : Number,
    coordinates: { type: [Number] }
  },
  phone       : {type: String, required: true, unique: true},
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

businessSchema.index({ 'address.coordinates': '2d' });
module.exports = mongoose.model('Business', businessSchema);