// The Business controller
 
var Business = require('../models/businessModel.js');
var Address = require('../models/addressModel.js');

  /**
   * Creates a new Business from the data request
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.createNewBusiness = function(req, res) {

    console.log('POST - /business');

    var business = new Business();
    business.name = req.body.name;
    business.businessType = req.body.businessType;
    business.phone = req.body.phone;
    business.website = req.body.website;

    var address = new Address({
      city : req.body.address.city,
      street : req.body.address.street,
      homeNumber : req.body.address.homeNumber,
      coordinates : {
        lat : req.body.address.coordinates.lat,
        lng : req.body.address.coordinates.lng
      }
    });
    business.address.push(address);
    
    business.save(function(err) {

      if(err) {
        console.log('Error while saving business: ' + err);
        res.send({ error:err });
        return;

      } else {
        console.log("Business created");
        return res.send(business);
      }
    });
  };

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
   * Find and retrieves a single business by its name and address
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.findBusinessById = function(req, res) {
    console.log("GET - /business/:name");
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
   * Update a Business by its name and address
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.updateBusinessById = function(req, res) {

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
   * Delete a Business by its name and address
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.deleteBusiness = function(req, res) {

    console.log("DELETE - /business/:name");
    
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