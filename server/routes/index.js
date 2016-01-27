var express = require('express');
var router = express.Router();
var images = require('./images');
var trees = require('./trees');
var app = require('../app');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/images', images.testOpenCV); // test openCV
router.post('/api/images', images.uploadImage(app.get('images'))); // receive photo of leaf from client

router.get('/api/trees', trees.getList);
router.post('/api/trees', trees.addTree);
router.post('/api/trees/dtw', trees.findTree);


module.exports = router;
