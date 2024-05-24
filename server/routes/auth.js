const express = require('express');
const router = express.Router();
const passport = require('passport');

// POST request for logging in
router.post('/login', passport.authenticate('local'), (req, res, next) => {
    if (req.user) {
        res.send(req.user);
    } else {
        res.send("Login failed");
    }
});

// POST request for logging out
router.post('/logout', (req, res) => {
    req.logout(err => {
      if (err) {
        return next(err); 
      }
      return res.send("Logout successful");
    });
});

// this route is for testing purposes
const { isAuth } = require('../lib/authMiddleware');
router.get('/isauth', isAuth, (req,res) => {
  res.json(req.user);
});

module.exports = router;

/* 
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
      return res.send({ success : false, message : 'authentication failed' });
    }
    // ***********************************************************************
    // "Note that when using a custom callback, it becomes the application's
    // responsibility to establish a session (by calling req.login()) and send
    // a response."
    // Source: http://passportjs.org/docs
    // ***********************************************************************
    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.send({ success : true, message : 'authentication succeeded' });
    });      
    
  })(req, res, next);
});


https://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling
*/