// facebook authenication service, via passport js
 
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/userModel.js');

module.exports = passport.use(new FacebookStrategy({
    clientID: "800252983352901",
    clientSecret: "d3f24fc0704e166fe196c5927529552c",
    callbackURL: "/auth/facebook/callback"
  },

  // the callback function after a successful login via facebook 
  function(accessToken, refreshToken, profile, done) {

    // search for a user with the given facebook id
    User.findOne({ _id: profile.id }, function(err, user) {

      if (err) { 
        console.log(err); 
      }

      // if the user does not exist
      if (user == null) {

        var facebookEmail = profile.emails;
        if (facebookEmail && facebookEmail.length > 0) {
          facebookEmail = facebookEmail[0].value;
        } else {
          facebookEmail = "";
        }

        // create a new user from the facebook response
        var user = new User({
          _id: profile.id,
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          email: facebookEmail,
          imagePath: 'https://graph.facebook.com/' + profile.id + '/picture?height=48&width=48'
        });

        // persist the new user in the database
        user.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      }

      // the user object is handed to passport
      done(null, user);
    });
  }
));

https://graph.facebook.com/10152576019138953/picture?height=64&width=64

module.exports = passport.serializeUser(function(user, done) {
  done(null, user.id);
});

module.exports = passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});