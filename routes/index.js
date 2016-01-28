var express = require('express');
var router = express.Router();
var trees = require('./trees');
var app = require('../app');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Listy' });
});

router.get('/api/trees', trees.getList);
router.post('/api/trees', trees.addTree);
router.post('/api/trees/dtw', trees.findTree);


module.exports = router;
