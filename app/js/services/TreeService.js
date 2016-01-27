define(['angular'], function(angular) {
  "use strict";

  var factory = function(api, $q) {
    var Trees = api.all('trees');

    var trees;

    var getTreesPromise = Trees.getList().then(
      function(treesList) {
        return trees = treesList;
      }
    );

    function all() {
      return trees;
    }

    function addTree(tree) {
      return Trees.post(tree).then(function(res) {
        return res;
      });
    }

    function findTree(tree) {
      return Trees.all('dtw')
        .post(tree.descriptors[0].descriptor);
    }

    function getTree(trees, treeId) {
      for (var i = 0; i < trees.length; i++) {
        if (trees[i]._id === treeId) {
          return trees[i];
        }
      }
      return null;
    }

    function get(treeId) {
      // FIXME: get only one tree from server
      if (!trees) {
        return getTreesPromise.then(function(treesList){
          return getTree(treesList, treeId);
        });
      } else {
        var deferred = $q.defer();
        var tree = getTree(trees, treeId);
        deferred.resolve(tree);
        return deferred.promise;
      }
    }

    function getList(query) {
      if (query) {
        return Trees.getList().then(function(treesList) {
          trees = treesList;
          return trees;
        });
      }
      if (!trees) {
        return getTreesPromise;
      } else {
        var deferred = $q.defer();
        deferred.resolve(trees);
        return deferred.promise;
      }
    }

    var descriptorLengh = 3000;

    function getDescriptor(path) {
      var descriptor = [];
      var index = path.length / descriptorLengh;
      var ratio = Math.max(2, index);
      var offset = Math.ceil(ratio / 2);
      for (var i = 0; i < descriptorLengh; i++) {
        descriptor[i] = getAverage(
          i * index - offset,
          i * index + offset,
          path
        )
      }
      return descriptor;
    }

    var sum, count;

    function getAverage(from, to, path) {
      sum = 0;
      count = 0;
      for (var j = Math.round(from); j < Math.round(to); j++) {
        if (j < 0) {
          j = 0;
        }
        if (j > path.length - 1) {
          j = path.length - 1;
        }
        sum += path[j].y;
        count++;
        if (path.length - 1 < Math.round(to)) {
          break;
        }
      }

      return sum / count;
    }

    function remove(tree) {
      trees.splice(trees.indexOf(tree), 1);
    }


    return {
      add: addTree,
      all: all,
      find: findTree,
      get: get,
      getList: getList,
      getDescriptor: getDescriptor,
      remove: remove
    };

  };

  factory.$inject = ['api', '$q'];
  return factory;
});
