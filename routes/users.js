const express = require('express');
const router = express.Router();

const auth = require('./helpers/auth')
const User = require('../models/user');
const Post = require('../models/post');
const posts = require('./posts');

const multer = require('multer');
const Upload = require('s3-uploader');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
      console.log(file)
      let extArray = file.mimetype.split("/");
      let ext = extArray[extArray.length - 1];
      cb(null, Date.now() + "." + ext);
  }
});

const upload = multer({ storage });

let client = new Upload(process.env.S3_BUCKET, {
  aws: {
    path: 'folder/',
    region: process.env.S3_REGION,
    acl: 'public-read',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  cleanup: {
    original: true,
    versions: true
  },
  versions: [{
  }]
});

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

// Users profile edit
router.get('/edit', (req, res, next) => {
  res.render('users/edit');
})

router.post('/edit', (req, res, next) => {
  const user = new User(req.body);

  user.save(function(err, user) {
    if(err) console.log(err);
    return res.redirect('/');
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

// Posts create
router.post('/:id', upload.single('picUrl'), (req, res) => {
    let post = new Post(req.body);
    post.users.push(req.session.userId);

    console.log(req.file)
    if (req.file) {
          client.upload(req.file.path, {}, function (err, versions, meta) {
            if (err) {
                console.log("Error after uploading - ", err)
                return res.status(400).send({ err: err });
            }
            console.log(versions)
            post.picUrl = versions[0].url;
              Post.create(post).then(() => {
                console.error("hello hello");
                return res.redirect(`/users/${req.session.username}`);
              }).catch((err) => {
                console.log(err.message);
              });
        });
    } else {
        Post.create(post).then(() => {
          console.error("Post created, but image cannot be uploaded");
          return res.redirect(`/users/${req.session.username}`);
        });
    }
});

router.use('/:userId/posts', posts);
module.exports = router;
