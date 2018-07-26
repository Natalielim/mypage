const express = require('express');
const auth = require('./helpers/auth');
const User = require('../models/user');
const router = express.Router({mergeParams: true});

// Posts new
router.get('/new', auth.requireLogin, (req, res, next) => {
  User.findById(req.params.roomId, function(err, user) {
      if(err) { console.error(err) };

      res.render('posts/new', { user: user });
    });
});

// Posts create
router.post('/', auth.requireLogin, (req, res, next) => {
  User.findById(req.params.userId, function(err, user) {
      if(err) { console.error(err) };

      let post = new Post(req.body);
      post.user = user;

      post.save(function(err, post) {
        if(err) { console.error(err) };

        return res.redirect(`/users/${user._id}`);
      });
    });
})

module.exports = router;
