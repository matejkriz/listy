var express = require('express');
var router = express.Router();
var images = require('./images');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/images', images.testOpenCV); // test openCV
router.post('/images', images.uploadImage(app.get('images'))); // receive photo of leaf from client


module.exports = router;
