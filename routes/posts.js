const express = require('express');
const router = express.Router({mergeParams: true});

const auth = require('./helpers/auth');
const User = require('../models/user');
const Post = require('../models/post');

// Posts new
// router.get('/new', auth.requireLogin, (req, res, next) => {
//   User.findById(req.params.userId, function(err, user) {
//     if(err) { console.error(err) };
//     console.log("new post loading");
//     res.render('posts/new', { username: req.session.username });
//     console.log("error here?")
//
//   });
// });
//
// // Posts create
// router.post('/', auth.requireLogin, (req, res, next) => {
//   User.findById(req.params.userId, function(err, user) {
//     if(err) { console.error(err) };
//
//     let post = new Post(req.body);
//     post.user = user;
//
//     post.save(function(err, post) {
//       if(err) { console.error(err) };
//
//       console.log("new post?")
//       return res.redirect(`/users/${req.session.username}`);
//     });
//   });
// });

module.exports = router;
