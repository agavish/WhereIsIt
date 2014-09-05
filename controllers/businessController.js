// The Business controller
 
var Business = require('../models/businessModel.js');
var mongoose = require('mongoose');
var geolib = require('geolib');

  /**
   * Creates a new Business from the data request
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.createNewBusiness = function(req, res) {

    console.log('POST - /api/business');

    if (!req.user) {
      res.statusCode = 403;
      console.log('User not logged in, unauthorized',res.statusCode);
      return res.send({ error: 'User not logged in, unauthorized' });
    }

    var body = req.body;
    var newBusiness = fillBusinessModel(body);

    Business.create(newBusiness, function(err, result) {
      if(err) {
        console.log('Error while saving businesses: ' + err);
        res.send({ error:err });
        return;

      } else {
        console.log("Businesses created");
        return res.send(result);
      }
    });
  };

fillBusinessModel = function(business) {
  var businessModel = new Business();
  businessModel.name = business.name;
  businessModel.businessType = business.businessType;
  businessModel.phone = business.phone;
  businessModel.website = business.website;
  businessModel.address.city = business.address.city,
  businessModel.address.street = business.address.street,
  businessModel.address.homeNumber = business.address.homeNumber,
  businessModel.address.coordinates = business.address.coordinates,

  businessModel.openHours = [];
  for (var i=0; i<business.openHours.length; i++) {
    var currDay = {};
    currDay.day = business.openHours[i].day;
    currDay.startHour = business.openHours[i].startHour;
    currDay.endHour = business.openHours[i].endHour;
    businessModel.openHours.push(currDay);
  }
  
  return businessModel;
}



  /**
   * Find and retrieves all Businesses
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.findAllBusinesses = function(req, res) {
    console.log("GET - /api/business");
    return Business.find(function(err, businesses) {
      if(!err) {
        return res.send(businesses);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Find and retrieve businesses by keyword
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.findBusinessesByKeyword = function(req, res) {
    console.log("GET - /api/business/keyword/:keyword");
    var regex = new RegExp(req.params.keyword, "i");

    return Business.find( {$or:[{name: regex}, {businessType: regex}]} , function(err, businesses) {
      if(!businesses || !businesses[0]) {
        res.statusCode = 404;
        return res.send({ error: 'Businesses Not found' });
      }

      var coordinatesStr = req.query.coordinates;
      var coordinates = "";
      var myLongitude = "";
      var myLatitude = "";
      if (coordinatesStr) {
        coordinates = coordinatesStr.split(",");
        myLongitude = parseFloat(coordinates[0]);
        myLatitude = parseFloat(coordinates[1]);
      }

      if(!err) {
        if (coordinates) {
          for (i=0; i<businesses.length; i++) {
            var business = businesses[i];
            var businessLongitude = business.address.coordinates[0];
            var businessLatitude = business.address.coordinates[1];
            var distanceMeters = geolib.getDistance(
              { latitude : myLatitude, longitude : myLongitude },
              { latitude : businessLatitude, longitude : businessLongitude }
            );
            if (distanceMeters > 1000) {
              distanceKilometers = distanceMeters/1000;
              distanceKilometers = distanceKilometers.toFixed(2);
            }
            businesses[i]._doc.distanceMeters = distanceMeters;
            businesses[i]._doc.distanceKilometers = distanceKilometers;
          }

          businesses.sort(function(a, b) {
            var keyA = a._doc.distanceMeters,
            keyB = b._doc.distanceMeters;
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
          });
        }
        return res.send(businesses);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Find and retrieve all businesses within 1 km from the given coordinates
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.findNearest = function(req, res) {
    console.log("GET - /api/business/nearest/:coordinates");

    var coordinatesStr = req.params.coordinates;
    var coordinates = coordinatesStr.split(",");
    var longitude = parseFloat(coordinates[0]);
    var latitude = parseFloat(coordinates[1]);

    // the order is important. the first item must be longitude, the second must be latitude.
    // this is mongodb spatial queries restriction, and that is the order we save business.address.coordinates
    coordinates[0] = longitude;
    coordinates[1] = latitude;

    // we use direct mongo API because this method retrieves also the distance from the current coordinates (mongoose does not).
    mongoose.connection.db.executeDbCommand({ 
      geoNear : "businesses",           // the mongo collection
      near : coordinates,               // the geo point
      spherical : true,                 // tell mongo the earth is round, so it calculates based on a spherical location system
      distanceMultiplier: 6371,         // tell mongo how many radians go into one kilometer.
      maxDistance : 1/6371,             // tell mongo the max distance in radians to filter out - currently, search within 1 km radius
    }, function(err, data) {
      if(!data.documents[0].results || !data.documents[0].results[0]) {
        res.statusCode = 404;
        return res.send({ error: 'Businesses Not found' });
      }

      if (!err) {
        // by default, mongo gives the distance in km.
        // we'd like to get the distances in meters
        var result = data.documents[0].results;
        for (i = 0; i < result.length; i++) {
          var distance = result[i].dis;
          var distanceMeters = Math.ceil(distance * 1000);
          result[i].distanceMeters = distanceMeters;
        }
        return res.send(result);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };


  /**
   * Find a Business by its id
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.findBusinessById = function(req, res) {
  console.log("GET - /api/business/:id");

  return Business.find({"_id" : req.params.id}, function(err, business) {

    if (!business || !business[0]) {
      res.statusCode = 404;
      console.log("error: Business Not Found");
      return res.send({ error: 'Business Not Found' });
    }

    if (!err) {
      return res.send(business[0]);
    } else {
      res.statusCode = 500;
      console.log('Internal error(%d): %s', res.statusCode, err.message);
      return res.send({ error: 'Server error' });
    }
  });
}

  /**
   * Update a Business by its id
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.updateBusinessById = function(req, res) {

    console.log("PUT - /api/business/:id");
    if (!req.user) {
      res.statusCode = 401;
      console.log('User not logged in, unauthorized',res.statusCode);
      return res.send({ error: 'User not logged in, unauthorized' });
    }

    return Business.find({"_id": req.params.id}, function(err, business) {

      if(!business || !business[0]) {
        res.statusCode = 404;
        console.log("error: Business Not Found");
        return res.send({ error: 'Business Not found' });
      }

      if (req.body.businessType != null) business[0].businessType = req.body.businessType;
      if (req.body.phone != null) business[0].phone = req.body.phone;
      if (req.body.rate != null) {

        // check if current userId already rated the business
        for(var i=0; i < business[0].rates.length; i++) {
          if (business[0].rates[i].userId == req.body.userId) {
            res.statusCode = 500;
            console.log("error: user id %d already rated business id %d", req.body.userId, req.params.id);
            return res.send({ error: "User already rated that business" });
          }
        }

        // user didn't rate that business yet, creating a new rate
        var newRate = {
          userId: req.body.userId,
          rate: req.body.rate
        }

        business[0].rates.push(newRate);

        var totalRate = 0;
        var numOfRates = business[0].rates.length;

        for (var i = 0; i < numOfRates; i++) {
            totalRate += business[0].rates[i].rate;
        }

        business[0].averateRate = parseFloat(totalRate/numOfRates);
      }

      return business[0].save(function(err) {
        if(!err) {
          console.log('Business Updated');
          return res.send({ status: 'OK', business:business });
        } else {
          if(err.name == 'ValidationError') {
            res.statusCode = 400;
            res.send({ errorName: 'Validation error', error: err });
          } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
          }
          console.log('Internal error(%d): %s',res.statusCode,err.message);
        }

        return res.send(business);

      });
    });
  };