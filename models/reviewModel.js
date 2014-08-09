var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
   
var reviewSchema = new Schema({
    userId     : { type: ObjectId, required: true },
    businessId : { type: ObjectId, required: true },
    content    : { type: String, required: true },
    date       : Date,
});

module.exports = mongoose.model('Review', reviewSchema);