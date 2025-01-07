const express = require("express");
const router = express.Router();
const passport = require("passport");
const {createUser, loginUser, logoutUser, currentUser} = require('../contoller/userController')
const {isAuthenticated} = require('../Middelware/isAuthenticated');
const User = require("../model/User");


router.post('/register', createUser)

router.post('/login', loginUser)
  
router.post("/logout", logoutUser)
router.get('/current', isAuthenticated, currentUser)

module.exports = router;
