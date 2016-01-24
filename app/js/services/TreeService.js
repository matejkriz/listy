define(['angular'], function(angular) {
  "use strict";

  var factory = function(api) {
    var Trees = api.all('trees');

    // Some fake testing data
    var trees = [{
      id: 0,
      name: 'Dub letní',
      nameLatin: 'Quercus robur',
      image: 'dub.jpg'
    }, {
      id: 1,
      name: 'Javor klen',
      nameLatin: 'Acer pseudoplatanus',
      image: 'javor.jpg'
    }, {
      id: 2,
      name: 'Olše lepkavá',
      nameLatin: 'Alnus glutinosa',
      image: 'olse.jpg'
    }, {
      id: 3,
      name: 'Jabloň domácí',
      nameLatin: 'Malus domestica',
      image: 'jablon.jpg'
    }, {
      id: 4,
      name: 'Buk lesní',
      nameLatin: 'Fagus sylvatica',
      image: 'buk.jpg'
    }];

    function addTree(tree) {
      return Trees.post(tree).then(function(res) {
        console.log("response = ", res);
      });
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
        if(path.length - 1 < Math.round(to)) {
          break;
        }
      }

      return sum / count;
    }


    return {
      all: function() {
        return trees;
      },
      remove: function(tree) {
        trees.splice(trees.indexOf(tree), 1);
      },
      get: function(treeId) {
        for (var i = 0; i < trees.length; i++) {
          if (trees[i].id === parseInt(treeId)) {
            return trees[i];
          }
        }
        return null;
      },
      add: addTree,
      getDescriptor: getDescriptor

    };

  };

  factory.$inject = ['api'];
  return factory;
});
