var app = require('express');
var router = app.Router();
var passport = require('passport');

// set up the RESTful API, handler methods are defined in controllers
var reviewController = require('../controllers/reviewController.js');
var businessController = require('../controllers/businessController.js');
var userController = require('../controllers/userController.js');

router.get('/api/users', userController.findAllUsers);
router.get('/api/users/:id', userController.findUserById);
router.get('/api/users/FavoriteBusiness/:id',userController.getFavoriteBusinessByUserId)
router.get('/api/users/LastVisitedBusiness/:id',userController.getLastVisitedBusinessUserId)
router.put('/api/users/:id', userController.updateUserById);
router.post('/api/users', userController.createNewUser);
router.delete('/api/users/:id', userController.deleteUser);

router.get('/api/business/nearest/:coordinates', businessController.findNearest);
router.get('/api/business/keyword/:keyword', businessController.findBusinessesByKeyword);
router.get('/api/business/:id', businessController.findBusinessById);
router.get('/api/business', businessController.findAllBusinesses);
router.put('/api/business/:id', businessController.updateBusinessById);
router.post('/api/business', businessController.createNewBusiness);

router.get('/api/review/:id', reviewController.findReviewById);
router.get('/api/review/user/:userId', reviewController.findReviewsByUserId);
router.get('/api/review/business/:businessId', reviewController.findReviewsByBusinessId);
router.post('/api/review', reviewController.createNewReview);
router.delete('/api/review/:id', reviewController.deleteReview);

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

router.get('*', function (req, res) {
  res.render('index.html', { user: req.user ? req.user : null });
});

module.exports = router;