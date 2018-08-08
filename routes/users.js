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
    return res.redirect('/login');
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
      res.render('users/show', { username: req.session.username, user: req.session.userId, posts: posts});
    }
  });
})

// Users profile edit
router.get('/:id/edit', (req, res, next) => {
  res.render('users/edit');
})

// Users show Profile
router.post('/:id', upload.single('profile'), (req, res) => {
    let user = new User(req.body);
    if (req.file) {
      client.upload(req.file.path, {}, function (err, versions, meta) {
        if (err) {
            return res.status(400).send({ err: err });
        }
        User.profile = versions[0].url;
      });
    }

    user.save(function(err, user) {
      if(err) console.log(err);
      return res.redirect('/:id');
    });
    // } else {
    //     User.create(post).then(() => {
    //       return res.redirect(`/users/${req.session.username}`);
    //     });
});

// Posts new
router.get('/:id/posts/new', auth.requireLogin, (req, res, next) => {
  User.findById(req.params.userId, function(err, user) {
    if(err) { console.error(err) };
    console.log("new post loading");
    res.render('posts/new', { username: req.session.username });
  });
});

// Posts create
router.post('/:id', upload.single('picUrl'), (req, res) => {
    let post = new Post(req.body);
    post.users.push(req.session.userId);

    if (req.file) {
          client.upload(req.file.path, {}, function (err, versions, meta) {
            if (err) {
                return res.status(400).send({ err: err });
            }
            console.log(versions)
            post.picUrl = versions[0].url;
              Post.create(post).then(() => {
                return res.redirect(`/users/${req.session.username}`);
              }).catch((err) => {
                console.log(err.message);
              });
        });
    } else {
        Post.create(post).then(() => {
          return res.redirect(`/users/${req.session.username}`);
        });
    }
});

// Delete Posts
router.delete('/:id/posts/:id', auth.requireLogin, (req, res, next) => {
  Post.findByIdAndDelete(req.params.id).then(() => {
    return res.redirect('/:id');
  }).catch((err) => {
    console.log(err.message);
  });

  console.log(req.params.id);
})

router.use('/:userId/posts', posts);
module.exports = router;
