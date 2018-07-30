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
  Post.find({users: res.locals.currentUserId}).sort({ date: -1}).exec(function(err, posts) {
    if(err) {
      console.error(err);
    } else {
      res.render('users/show', { user: req.session.username, posts: posts});
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
  Post.findById(req.params.userId, function(err, user) {
    if(err) { console.error(err) };

    let post = new Post(req.body);
    post.users.push(req.session.userId);

    post.save(function(err, post) {
      if(err) { console.error(err) };
      console.log("new post posting 1")
      return res.redirect(`/users/${req.session.username}`);
    });
  });
});

// Posts edit
router.get('/:id/posts/:id/edit', auth.requireLogin, (req, res, next) => {
  Post.findById(req.params.id, function(err, post) {
    if (err) { console.error(err); }

    res.render('posts/edit', { post: post });
  });
});

// Posts update
router.post('/:id/posts/:id', auth.requireLogin, (req, res, next) => {
  Post.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
    if(err) { console.error(err) };

    res.redirect('posts/:id');
  });
});

// // Posts update
// router.delete('/:id', auth.requireLogin, (req, res, next) => {
//   Post.findByIdAndRemove(req.body.delete_id, function(err, post) {
//     if (err) { console.error(err); }
//     res.redirect('/posts/'+post._id);
//   });
// });

router.use('/:userId/posts', posts);

module.exports = router;
