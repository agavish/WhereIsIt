var app = require('express');
var router = app.Router();
var passport = require('passport');

// set up the RESTful API, handler methods are defined in controllers
var userController = require('../controllers/userController.js');
var businessController = require('../controllers/businessController.js');
var reviewController = require('../controllers/reviewController.js');

router.get('/users', userController.findAllUsers);
router.get('/users/:id', userController.findUserById);
router.put('/users/:username', userController.updateUserById);
router.post('/users', userController.createNewUser);
router.delete('/users/:id', userController.deleteUser);

router.get('/business/nearest/:coordinates', businessController.findNearest);
router.get('/business/:name/', businessController.findBusinessByName);
router.get('/business', businessController.findAllBusinesses);
router.put('/business/:name', businessController.updateBusinessByName);
router.post('/business', businessController.createNewBusiness);
router.delete('/business/:id', businessController.deleteBusiness);

router.get('/review/:id', reviewController.findReviewById);
router.get('/review/user/:userId', reviewController.findReviewsByUserId);
router.get('/review/business/:businessId', reviewController.findReviewsByBusinessId);
router.post('/review', reviewController.createNewReview);
router.delete('/review/:id', reviewController.deleteReview);

// redirect the user to facebook for authentication.  when complete,
// facebook will redirect the user back to the application at
// /auth/facebook/callback
router.get('/auth/facebook', passport.authenticate('facebook'));

// facebook will redirect the user to this URL after approval.  finish the
// authentication process by attempting to obtain an access token.  if
// access was granted, the user will be logged in.  otherwise,
// authentication has failed.
router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/auth/success',
                                      failureRedirect: '/auth/failure' }));

router.get('/auth/success', function(req, res) {
  res.render('after-auth.html', { state: 'success', user: req.user ? req.user : null });
});
router.get('/auth/failure', function(req, res) {
  res.render('after-auth.html', { state: 'failure', user: null });
});

router.delete('/auth', function(req, res) {
  req.logout();
  res.writeHead(200);
  res.end();
});

// app.get('/', routes.index);

router.get('/*', function (req, res) {
  res.render('index.html', { user: req.user ? req.user : null });
});

module.exports = router;