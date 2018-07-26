var express = require('express');
var router = express.Router();

const User = require('../models/user');

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// SET layout variables
router.use( (req, res, next) => {
  res.locals.title = "Welcome";
  res.locals.currentUserId = req.session.userId;
  res.locals.username = req.session.username;
  next();
});

// GET home page
router.get('/', (req, res, next) => {
  res.render('index');
});

// GET login
router.get('/login', (req, res, next) => {
  res.render('login');
});

// POST login
router.post('/login', (req, res, next) => {
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err || !user) {
      const next_error = new Error("Username or password incorrect");
      next_error.status = 401;

      return next(next_error);
    } else {
      req.session.userId = user._id;
      req.session.username = user.username;

      return res.redirect('/') ;
    }
  });
});

// POST logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return next(err);
    });
  }

  return res.redirect('/login');
});

module.exports = router;

// //configuring the AWS environment
// AWS.config.update({
//     accessKeyId: "AKIAJLYHLY5DGOAD5VAA",
//     secretAccessKey: "B+QU4hB5x7ICuM/wKw3nQpQHZiqqS+7g9xObXXxX"
//   });
//
// var s3 = new AWS.S3();
// var filePath = "app.js";
//
// //configuring parameters
// var params = {
//   Bucket: 'mypage-webapp',
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
