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
  rates: [{
    userId: String,
    rate: { type: Number, default: 0, max: 5 }
    }],
  averageRate:      { type: Number, default: 0 },
  totalRate:        { type: Number, default: 0 },
  description:      { type: String },
  reviews     :     [ { type: Schema.ObjectId, ref: 'Review' } ]
});

// index address.coordinates with 2d for geo spatial queries
businessSchema.index({ 'address.coordinates': '2dsphere' });
// primary key is 'name' + 'address.coordinates'
businessSchema.index({ 'address.coordinates': 1, 'name': 1 }, { unique: true });
// index businessType for findBusinessesByKeyword
businessSchema.index('businessType');

//delete review from business by review id
businessSchema.statics.deleteReviewById = function(businessId,reviewId,callback) {
    this.findOne({"_id": businessId}, function(err,business) {
        if (err) {
            callback(err,404);
        } else if (business) {
            var index = business.reviews.indexOf(reviewId);
            business.reviews.splice(index,1);
            business.save(function(err) {
                if (err) {
                    callback(err,500);
                } else {
                    callback(err,200);
                }
            });
        }
    });
}
module.exports = mongoose.model('Business', businessSchema);