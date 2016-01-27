var debug = require('debug')('api:trees');
var Tree = require('../models/Tree');
var util = require('util');
var dtwLib = require('dtw');
var dtw = new dtwLib();
var myDTW = require('../lib/dtw');

exports.addTree = addTree;
exports.getList = getList;
exports.findTree = findTree;

var treesList = [];

function addTree(req, res, next) {
  //debug(util.inspect(req.body));
  //TODO: add validation of input

  Tree.create(req.body, function(err, tree) {
    if (err) return next(err);
    res.send('Tree ' + tree.tree + ' was saved with ID: ' + tree._id);
  });
};

var defaultQuery = {
  startIndex: 0,
  limitation: 30,
  sort: {
    name: 1
  },
  filters: {},
  select: {
    descriptors: 0
  }
};

function getList(req, res, next) {
  //debug(util.inspect(req));
  var query = defaultQuery;

  Tree.find(query.filters || {})
    .sort(query.sort)
    .skip(query.startIndex)
    .limit(query.limitation)
    .select(query.select)
    .exec(function(err, trees) {
      if (err) return next(err);
      treesList = trees;
      res.send(treesList);
    });
};

function findClosest(sourceDescriptor) {
  var dbDescriptor, cost, myCost, index;
  var minCost = Infinity;
  for (var i = 0; i < treesList.length; i++) {
    for (var j = 0; j < treesList[i].descriptors.length; j++) {
      dbDescriptor = treesList[i].descriptors[j].descriptor;
      //cost = dtw.compute(dbDescriptor, sourceDescriptor);
      cost = myDTW.DTWDistance(dbDescriptor, sourceDescriptor, 300);
      debug("treename: cost", treesList[i].name, ': ', cost);
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
  if (!req.body.length || req.body.length < 1) {
    res
      .status(400)
      .send('Missing descriptors!');
  } else {
    Tree.find().exec(function(err, trees) {
      if (err) return next(err);
      treesList = trees;
      var resultTree = findClosest(req.body);
      res.send(resultTree);
    });
  }
}
