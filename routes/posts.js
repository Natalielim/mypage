const express = require('express');
const router = express.Router({mergeParams: true});

const auth = require('./helpers/auth');
const User = require('../models/user');
const Post = require('../models/post');

// Posts new
router.get('/new', auth.requireLogin, (req, res, next) => {
  User.findById(req.params.userId, function(err, user) {
    if(err) { console.error(err) };

    res.render('posts/new', { username: req.session.username });
  });
});

// Posts create
router.post('/', auth.requireLogin, (req, res, next) => {
  User.findById(req.params.userId, function(err, user) {
    if(err) { console.error(err) };

    let post = new Post(req.body);
    post.user = user;
    post.user.push(req.session.userId);

    post.save(function(err, post) {
      if(err) { console.error(err) };

      console.log("POSTS")
      return res.redirect(`/users/${req.session.username}`);
    });
  });
});

// Posts show
router.get('/:id', auth.requireLogin, (req, res, next) => {
  Post.findById(req.params.userId, function(err, user) {
    if(err) { console.error(err) };

    res.render('posts/show', { user: req.session.username, post: post });
  });
});

module.exports = router;
