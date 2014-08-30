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
  name:             { type: String, required: true },
  businessType:     { type: String, required: true },
  address: { 
    city:           { type: String },
    street:         { type: String },
    homeNumber:     { type: Number },
    coordinates:    { type: [Number], required: true }
  },
  phone:            { type: String },
  website:          { type: String },
  imagePath:        { type: String },
  openHours: [{
    day:            { type: String },
    startHour:      { type: String },
    endHour:        { type: String }
  }],
  numOfScores:      { type: Number },
  score:            { type: Number },
  description:      { type: String },
  reviews     :     { type: [Schema.ObjectId], ref: 'Review' },
});

// primary key is 'name' + 'address.coordinates'
businessSchema.index({ 'name': 1, 'address.coordinates': 1}, { unique: true });
// index name for findBusinessesByKeyword
businessSchema.index('name');
// index businessType for findBusinessesByKeyword
businessSchema.index('businessType');
// index address.coordinates with 2d for geo spatial queries
businessSchema.index({ 'address.coordinates': '2d' });
module.exports = mongoose.model('Business', businessSchema);