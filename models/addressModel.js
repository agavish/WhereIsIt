var mongoose = require('mongoose')
   ,Schema = mongoose.Schema

// Address
var addressSchema = new Schema({
    city       : String,
    street     : String,
    homeNumber : Number,
    coordinates: {
      lat: { type:Number },
      lng: { type:Number }
    }
});

module.exports = mongoose.model('Address', addressSchema);