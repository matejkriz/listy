var debug = require('debug')('api:trees');
var Tree = require('../models/Tree');
var util = require('util');


exports.addTree = addTree;

function addTree(req, res, next) {
  //TODO: add validation of input
  var tree = new Tree(req.body);
  debug(util.inspect(tree));
  Tree.save(function(err, tree) {
    if (err) return next(err);
    res.send('Tree ' + tree.tree + ' was saved with ID: ', tree._id);
  });
};
