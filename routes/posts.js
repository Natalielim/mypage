const express = require('express');
const router = express.Router({mergeParams: true});

const auth = require('./helpers/auth');
const User = require('../models/user');
const Post = require('../models/post');

// Posts new
router.get('/new', auth.requireLogin, (req, res, next) => {
  User.findById(req.params.userId, function(err, user) {
    if(err) { console.error(err) };

    console.log("new post loading");
    res.render('posts/new', { username: req.session.username });
  });
});

// Posts create
router.post('/', auth.requireLogin, (req, res, next) => {
  Post.findById(req.params.userId, function(err, user) {
    if(err) { console.error(err) };

    let post = new Post(req.body);
    post.users.push(req.session.userId);

    post.save(function(err, post) {
      if(err) { console.error(err) };

      console.log("new post posting");
      return res.redirect(`/users/${req.session.username}`);
    });
  });
});

// Posts show
router.get('/:id', auth.requireLogin, (req, res, next) => {
  Post.findById(req.params.id, function(err, post) {
    if(err) { console.error(err) };

    res.render('posts/show', { username: req.session.username, post: post });
  });
});

// Posts edit
router.get('/:id/edit', auth.requireLogin, (req, res, next) => {
  Post.findById(req.params.id, function(err, post) {
    if (err) { console.error(err); }

    res.render('posts/edit', { post: post });
  });
});

// Posts update
router.post('/:id', auth.requireLogin, (req, res, next) => {
  Post.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
    if(err) { console.error(err) };

    res.redirect('posts/:id');
  });
});

// Posts delete
router.delete('/', auth.requireLogin, (req, res, next) => {
  Post.findByIdAndRemove(req.params.id, function(err, post) {
    if (err) { console.error(err); }
    res.redirect('/');
  });
});


module.exports = router;
