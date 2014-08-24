// The Business controller
 
var Business = require('../models/businessModel.js');
var Address = require('../models/addressModel.js');
var mongoose = require('mongoose');

  /**
   * Creates a new Business from the data request
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.createNewBusiness = function(req, res) {

    console.log('POST - /business');
    var body = req.body;
    var result = [];

    if (body.businesses) {
      var businesses = body.businesses;
      for (i = 0; i < businesses.length; i++) {
        result.push(fillBusinessModel(businesses[i]));
      }
    }
    else {
      result.push(fillBusinessModel(body));
    }

    Business.create(result, function(err, result) {

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
    businessModel.address.coordinates = business.address.coordinates 
    return businessModel;
  }



  /**
   * Find and retrieves all Businesses
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.findAllBusinesses = function(req, res) {
    console.log("GET - /business");
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
   * Find and retrieves a single business by its id
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.findBusinessByName = function(req, res) {
    console.log("GET - /business/:name/");
    return Business.find({name: req.params.name}, function(err, business) {
      if(!business || !business[0]) {
        res.statusCode = 404;
        return res.send({ error: 'Business Not found' });
      }

      if(!err) {
        return res.send(business[0]);
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Find and retrieves a single business by its id
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.findNearest = function(req, res) {
    console.log("GET - /business/nearest/:coordinates");

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
      spherical : true,                 // tell mongo the earth is round, so it calculates based on a 
                                        // spherical location system
      distanceMultiplier: 6371,         // tell mongo how many radians go into one kilometer.
      maxDistance : 1/6371,             // tell mongo the max distance in radians to filter out - currently, search within 1 km radius
    }, function(err, data) {
      if(!data.documents[0].results || !data.documents[0].results[0]) {
        res.statusCode = 404;
        return res.send({ error: 'Businesses Not found' });
      }

      if (!err) {
        var result = data.documents[0].results;
        for (i = 0; i < result.length; i++) {
          var distance = result[i].dis;
          distance = Math.ceil(distance * 1000);
          result[i].dis = distance;
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
   * Update a Business by its name and address
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.updateBusinessByName = function(req, res) {

    console.log("PUT - /users/:name");

    return Business.find({name: req.params.name}, function(err, business) {

      if(!business || !business[0]) {
        res.statusCode = 404;
        console.log("error: Business Not Found");
        return res.send({ error: 'Business Not found' });
      }

      if (req.body.businessType != null) business[0].businessType = req.body.businessType;
      if (req.body.phone != null) business[0].phone = req.body.phone;

      return business[0].save(function(err) {
        if(!err) {
          console.log('Business Updated');
          return res.send({ status: 'OK', business:business });
        } else {
          if(err.name == 'ValidationError') {
            res.statusCode = 400;
            res.send({ error: 'Validation error' });
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

    /**
   * Delete a Business by its id
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.deleteBusiness = function(req, res) {

    console.log("DELETE - /business/:id");
    
    return Business.find({_id: req.params.id}, function(err, business) {
      if(!business || !business[0]) {
        res.statusCode = 404;
        console.log("error: Business Not Found");
        return res.send({ error: 'Business Not found' });
      }

      return business[0].remove(function(err) {
        if(!err) {
          console.log('Removed Business');
          return res.send({ status: 'OK' });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          return res.send({ error: 'Server error' });
        }
      })
    });
  };

    /**
   * Delete all Businesses
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
// exports.deleteAllBusinesses = function(req, res) {

//     console.log("DELETE - /business");
//     return Business.collection.remove(function(err) {
//       if(!err) {
//         console.log('Removed Businesses');
//         return res.send({ status: 'OK' });
//       } else {
//         res.statusCode = 500;
//         console.log('Internal error(%d): %s',res.statusCode,err.message);
//         return res.send({ error: 'Server error' });
//       }
//     });
//   };