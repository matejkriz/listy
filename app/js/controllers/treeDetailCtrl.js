(function() {
  'use strict';
  define([], function() {
    return ['$scope', '$stateParams', 'TreeService', function($scope, $stateParams, TreeService) {
      var vm = this;
      TreeService.get($stateParams.treeId)
        .then(function(tree) {
          vm.tree = tree;
        });
    }];
  });
})();
