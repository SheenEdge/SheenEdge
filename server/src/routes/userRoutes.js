const express = require("express");
const router = express.Router();
const passport = require("passport");
const {createUser, logoutUser, currentUser} = require('../contoller/userController')
const {isAuthenticated} = require('../Middelware/isAuthenticated');
const User = require("../model/User");


router.post('/register', createUser)

router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
	  if (err) { 
		return next(err); // Handle error
	  }
	  if (!user) {
		return res.status(401).json({ message: info.message }); // Authentication failed
	  }
	  req.logIn(user, (err) => { // Log in the user
		if (err) {
		  return next(err); // Handle error during login
		}
		// Send back the user details
		return res.json({ _id: user._id, name: user.name, email: user.email });
	  });
	})(req, res, next);
  });
  
router.post("/logout", logoutUser)
router.get('/current',isAuthenticated, currentUser)

module.exports = router;