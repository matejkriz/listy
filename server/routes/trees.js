var debug = require('debug')('api:trees');
var Tree = require('../models/Tree');
var util = require('util');
var dtwLib = require('dtw');
var dtw = new dtwLib();

exports.addTree = addTree;
exports.findTree = findTree;

var treesList = [];

function addTree(req, res, next) {
  debug(util.inspect(req.body));
  //TODO: add validation of input

  Tree.create(req.body, function(err, tree) {
    if (err) return next(err);
    res.send('Tree ' + tree.tree + ' was saved with ID: ' + tree._id);
  });
};

function findClosest(sourceDescriptor) {
  var dbDescriptor, cost, index;
  var minCost = Infinity;
  for (var i = 0; i < treesList.length; i++) {
    for (var j = 0; j < treesList[i].descriptors.length; j++) {
      dbDescriptor = treesList[i].descriptors[j].descriptor;
      cost = dtw.compute(dbDescriptor, sourceDescriptor);
      if (cost < minCost) {
        minCost = cost;
        index = i;
        console.log('minCost: ' + minCost);
      }
    }
  }
  return treesList[index];
}

function findTree(req, res, next) {
  Tree.find().exec(function(err, trees) {
    if (err) return next(err);
    treesList = trees;
    var resultTree = findClosest(req.body);
    res.send(resultTree);
  });




}
