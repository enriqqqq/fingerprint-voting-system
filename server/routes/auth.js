const express = require('express');
const router = express.Router();
const passport = require('passport');

// POST request for logging in
router.post('/login', (req, res, next) => {
  // https://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err); 
    }

    if(!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: 'Login successful', user });
    });

  })(req, res, next);
});

// POST request for logging out
router.post('/logout', (req, res) => {
    req.logout(err => {
      if (err) {
        return next(err); 
      }
      return res.status(200).json({ message: 'Logout successful' });
    });
});

// GET request for checking if user is authenticated
router.get('/isauth', (req,res) => {
  if(!req.user){
    res.json({ user: null });
    return;
  }

  res.json({ user: req.user });
});

module.exports = router;