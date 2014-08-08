var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var businessSchema = new Schema({
	name        : { type: String, required: true },
//    address     : { Type: Address, required: true },
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

module.exports = mongoose.model('Business', businessSchema);