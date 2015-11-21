var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(__dirname);
  res.render('index', { title: 'Express' });
//  res.sendFile(path.join(__dirname));
});

module.exports = router;
