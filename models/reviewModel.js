var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
   
var reviewSchema = new Schema({
    userId     : ObjectId,
    businessId : ObjectId,
    content    : String,
    date       : Date,
});

module.exports = mongoose.model('Review', reviewSchema);