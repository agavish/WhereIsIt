/**
 * Business
 *
 * @module      :: Model
 * @description :: Represent data model for the Businesses
 * @author      :: Adam Gavish
 */

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

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
  reviews     : [{ type: Schema.ObjectId, ref: 'Review' }],
});

businessSchema.index({ 'address.coordinates': '2d' });
module.exports = mongoose.model('Business', businessSchema);