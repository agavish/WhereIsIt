/**
 * Review
 *
 * @module      :: Model
 * @description :: Represent data model for the Reviews
 * @author      :: Adam Gavish
 */

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
   
var reviewSchema = new Schema({
    userId     : { type: String, required: true },
    businessId : { type: ObjectId, ref: 'Business', required: true },
    content    : { type: String, required: true },
    date       : Date,
});

module.exports = mongoose.model('Review', reviewSchema);