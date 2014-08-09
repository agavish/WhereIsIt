var mongoose = require('mongoose')
   ,Schema = mongoose.Schema

// Address
var addressSchema = new Schema({
    city       : String,
    street     : String,
    homeNumber : Number
});

module.exports = mongoose.model('Address', addressSchema);