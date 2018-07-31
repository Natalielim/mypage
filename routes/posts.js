const express = require('express');
const router = express.Router({mergeParams: true});

const auth = require('./helpers/auth');
const User = require('../models/user');
const Post = require('../models/post');

// const multer  = require('multer');
//
// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//       // TODO Look into edge cases
//       let extArray = file.mimetype.split("/");
//       let ext = extArray[extArray.length - 1];
//       cb(null, Date.now() + "." + ext);
//   }
// });
//
// const upload = multer({ storage });
// const Upload = require('s3-uploader');
//
// var client = new Upload('mypage-webapp', {
//   aws: {
//     path: 'images/',
//     region: 'us-west-1',
//     acl: 'public-read'
//   },
//
//   cleanup: {
//     versions: true,
//     original: false
//   },
//
//   original: {
//     awsImageAcl: 'private'
//   },
//
//   versions: [{
//     maxHeight: 1040,
//     maxWidth: 1040,
//     format: 'jpg',
//     suffix: '-large',
//     quality: 80,
//     awsImageExpires: 31536000,
//     awsImageMaxAge: 31536000
//   },{
//     maxWidth: 780,
//     aspect: '3:2!h',
//     suffix: '-medium'
//   },{
//     maxWidth: 320,
//     aspect: '16:9!h',
//     suffix: '-small'
//   },{
//     maxHeight: 100,
//     aspect: '1:1',
//     format: 'png',
//     suffix: '-thumb1'
//   },{
//     maxHeight: 250,
//     maxWidth: 250,
//     aspect: '1:1',
//     suffix: '-thumb2'
//   }]
// });

// let client = new Upload(process.env.S3_BUCKET, {
//   aws: {
//     path: 'mypage/images',
//     region: process.env.S3_REGION,
//     acl: 'public-read',
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//   },
//   cleanup: {
//     versions: true,
//     original: true
//   },
//   versions: [{
//     maxWidth: 320,
//     aspect: '1.618:1',
//     suffix: '-thumbnail'
//   },{
//     maxWidth: 1000,
//     aspect: '2.414:1', //silver ratio
//     suffix: '-desktop'
//   },{
//     maxWidth: 320,
//     aspect: '2.414:1', //silver ratio
//     suffix: '-mobile'
//   },{
//     maxWidth: 100,
//     aspect: '1:1',
//     suffix: '-square'
//   }]
// });

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
