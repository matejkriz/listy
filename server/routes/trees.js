var debug = require('debug')('server:server');
var Tree = require('../models/Tree');


exports.addTree = addTree;

function addTree(imagesDir) {
  return function(req, res, next) {
    var tree = req;
    debug('tree: ' + tree);
    // Tree.create({
    //   tree: String,
    // 	link: String,
    // 	imgLink: String,
    //   descriptors: [Number]
    // }, function(err) {
    //   if (err) return next(err);
    // });
  }
};
