//set variables for each that will be used in this route
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


//refer to user in user.js
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//render the registration page
router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});

//set route for login
router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

//post for login feature
router.post('/login',
  passport.authenticate('local', {failureRedirect:'/users/login', failureFlash: 'Invalid username or password.'}),
  function(req, res) {
    req.flash('success', 'You are now logged in.');
    res.redirect('/');
  });

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user) {
    done(err,user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  //get the username
  User.getUserByUsername(username, function(err, user) {
    if(err) throw err;
    //if there is not a user by that username, send message
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      //compare password, if match
      if(isMatch){
        return done(null, user);
      } else {
        //if not a match, send a message
        return done(null, false, {message: 'Invalid Password'});
      }
    });
  });
}));

//post request to register
router.post('/register', function(req, res, next) {
//set each field to a variable
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  //Form validator
  //make sure the required fields are not empty and are vaild
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email field not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  //Check Errors
  var errors = req.validationErrors();

  //check their email address to see if it's in use, if it is send error message, if not create user
  User.findOne({email: req.body.email}, function(err, user) {
  if(errors) {
    res.render('register', {
      errors: errors
    });
  } else if (user) {
    //error if the email is already used
    req.flash('error', 'Email address already in use.');
    res.redirect('/users/register');
  } else {
    //create new users
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });
    //create the user
    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    //success message
    req.flash('success', 'Congrats! You are now registered. Please log in.');

    //redirect
    res.location('/');
    res.redirect('/');
  }
});
});


//once logged out, show success message, redirect to login page
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out.');
  res.redirect('/users/login');
});

module.exports = router;
