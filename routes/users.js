const express = require('express');
const auth = require('./helpers/auth')
const User = require('../models/user');
const router = express.Router();

// Users index
router.get('/', (req, res, next) => {
  User.find({}, 'username', function(err, users) {
    if(err) {
      console.error(err);
    } else {
      res.render('index.hbs', { title: "My Page" });
    }
  });
});

// Users new
router.get('/new', (req, res, next) => {
  res.render('users/new');
})

// Users create
router.post('/', (req, res, next) => {
  const user = new User(req.body);

  user.save(function(err, user) {
    if(err) console.log(err);
    return res.redirect('/');
  });
})

// User get new
router.get('/new', (req, res, next) => {
  res.render('users/new');
})

module.exports = router;
