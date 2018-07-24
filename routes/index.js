var express = require('express');
var router = express.Router();

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "MY PAGE" });
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
