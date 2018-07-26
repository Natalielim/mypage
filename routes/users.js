const express = require('express');
const router = express.Router();

const auth = require('./helpers/auth')
const User = require('../models/user');
const Post = require('../models/post');
const posts = require('./posts');

// Users create
router.post('/', (req, res, next) => {
  const user = new User(req.body);

  user.save(function(err, user) {
    if(err) console.log(err);
    return res.redirect('/');
  });
})

// User new
router.get('/new', (req, res, next) => {
  res.render('users/new');
})

// Users show
router.get('/:id', auth.requireLogin, (req, res, next) => {
  User.find({ users: res.locals.currentUserId }, function(err, users, posts) {
    if(err) {
      console.error(err);
    } else {
      res.render('users/show', { title: req.session.username, posts: posts });
    }
  });
})

// Posts new
router.get('/:id/posts/new', auth.requireLogin, (req, res, next) => {
  User.findById(req.params.userId, function(err, user) {
    if(err) { console.error(err) };
    console.log("new post loading");
    res.render('posts/new', { username: req.session.username });
  });
});

// Posts create
router.post('/:id', auth.requireLogin, (req, res, next) => {
  User.findById(req.params.userId, function(err, user) {
    if(err) { console.error(err) };

    let post = new Post(req.body);
    post.user = user;
    post.user.push(req.session.userId);

    post.save(function(err, post) {
      if(err) { console.error(err) };

      console.log("new post?")
      return res.redirect(`/users/${req.session.username}`);
    });
  });
});

router.use('/:userId/posts', posts)

module.exports = router;
