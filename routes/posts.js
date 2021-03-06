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

// // Ferdinand's Posts create
// router.post('/', auth.requireLogin, upload.single('picUrl'), (req, res) => {
//   Post.findById(req.params.userId, function(err, user) {
//
//     let post = req.body;
//     post.users.push(req.session.userId);
//     let imageArray = ['picThumb', 'picUrl', 'picSquare', 'picMobile'];
//
//     if (req.file) {
//       client.upload(req.file.path, {}, function (err, versions, meta) {
//         if (err) {
//             return res.status(400).send({ err: err });
//         }
//
//         // Iterate through imageArray and add them to respective columns
//         for(let i = 0; i < imageArray.length; i++){
//             post[imageArray[i]] = versions[i].url;
//         }
//
//         // TODO: originally meant to have virtual variables,
//         // Couldn't get to it
//         // post.picUrl = versions[1].url;
//
//         model.Post.create(post).then(() => {
//             req.flash('success', 'Post created');
//             res.redirect('/');
//         });
//       });
//       post.save(function(err, post) {
//         if(err) { console.error(err) };
//
//         console.log("new post posting");
//         return res.redirect(`/users/${req.session.username}`);
//       });
//     } else {
//       model.Post.create(post).then(() => {
//           req.flash('success', 'Post created, but image cannot be uploaded');
//           res.redirect('/');
//       });
//     }
//   });
// });

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

module.exports = router;

// AWS IMPLEMENTATION

// AWS.config.update({
//     accessKeyId: config.accessKeyId,
//     secretAccessKey: config.secretAccessKey
//   });
//
// var s3 = new AWS.S3();
// var filePath = "./public/images/img.png";
//
// //configuring parameters
// var params = {
//   Bucket: config.bucketName,
//   Body : fs.createReadStream(filePath),
//   Key : "folder/"+Date.now()+"_"+path.basename(filePath)
// };
//
// s3.upload(params, function (err, data) {
//   //handle error
//   if (err) {
//     console.log("Error", err);
//   }
//
//   //success
//   if (data) {
//     console.log("Uploaded in:", data.Location);
//   }
// });
