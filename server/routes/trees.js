var debug = require('debug')('api:trees');
var Tree = require('../models/Tree');
var util = require('util');


exports.addTree = addTree;

function addTree(req, res, next) {
  debug(util.inspect(req.body));
  //TODO: add validation of input

  Tree.create(req.body, function(err, tree) {
    if (err) return next(err);
    res.send('Tree ' + tree.tree + ' was saved with ID: ' + tree._id);
  });
};
