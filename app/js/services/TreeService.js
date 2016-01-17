define(['angular'], function(angular) {
  "use strict";

  var factory = function() {

    // Some fake testing data
    var trees = [{
      id: 0,
      name: 'Dub letní',
      nameLatin: 'Quercus robur',
      image: 'img/dub.jpg'
    }, {
      id: 1,
      name: 'Javor klen',
      nameLatin: 'Acer pseudoplatanus',
      image: 'img/javor.jpg'
    }, {
      id: 2,
      name: 'Olše lepkavá',
      nameLatin: 'Alnus glutinosa',
      image: 'img/olse.jpg'
    }, {
      id: 3,
      name: 'Jabloň domácí',
      nameLatin: 'Malus domestica',
      image: 'img/jablon.jpg'
    }, {
      id: 4,
      name: 'Buk lesní',
      nameLatin: 'Fagus sylvatica',
      image: 'img/buk.jpg'
    }];

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
      }
    };

  };

  factory.$inject = [];
  return factory;
});
