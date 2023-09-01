const express = require('express');
const ucontroller = require('../controllers/userController');
const urouter = express.Router();
const {isGuest} = require('../middleware/auth');
const {isLoggedIn} = require('../middleware/auth');
const {validateSignUp, validateLogIn, validateResult} = require('../middleware/validator');
const {logInLimiter} = require('../middleware/rateLimiters');

//GET /users/new: send html form for creating a new user account
urouter.get('/new', isGuest, ucontroller.new);
//POST /users: create a new user account
urouter.post('/', isGuest, validateSignUp, validateResult, ucontroller.create);
//GET /users/login: send html for logging in
urouter.get('/login', isGuest, ucontroller.getUserLogin);
//POST /users/login: authenticate user's login
urouter.post('/login', logInLimiter, isGuest, validateLogIn, validateResult, ucontroller.login);
//GET /users/profile: send user's profile page
urouter.get('/profile', isLoggedIn, ucontroller.profile);
//POST /users/logout: logout a user
urouter.get('/logout', isLoggedIn, ucontroller.logout);



module.exports = urouter;