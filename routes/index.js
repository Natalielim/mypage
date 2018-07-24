var express = require('express');
var router = express.Router();
var myTitle = "TITLE";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: myTitle });
});

module.exports = router;
