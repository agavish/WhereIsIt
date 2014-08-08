// The User controller
 
var Business = require('../models/businessModel.js');

  /**
   * Creates a new Business from the data request
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
exports.createNewBusiness = function(req, res) {

    console.log('POST - /business');

    var business = new Business({
      name : req.body.name,
//      address: req.body.Address, 
      businessType : req.body.businessType,
      phone : req.body.phone
    });

    business.save(function(err) {

      if(err) {
        console.log('Error while saving business: ' + err);
        res.send({ error:err });
        return;

      } else {
        console.log("Business created");
        return res.send({ status: 'OK', business:business });
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
    return Business.find(function(err, business) {
      if(!err) {
        return res.send(business);
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
    return Business.find({name: req.params.name, address: req.params.address}, function(err, user) {
      if(!business || !business[0]) {
        res.statusCode = 404;
        return res.send({ error: 'Business Not found' });
      }

      if(!err) {
        return res.send({ status: 'OK', business:business });
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

    return Business.find({name: req.params.name, address: req.params.address}, function(err, user) {

      if(!business || !business[0]) {
        res.statusCode = 404;
        console.log("error: Business Not Found");
        return res.send({ error: 'Business Not found' });
      }

//      if (req.body.Address != null) business[0].address = req.body.Address;
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
    
    return Business.find({name: req.params.name, address: req.params.address}, function(err, user) {
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