(function() {
  'use strict';
  define([], function() {
    return ['$scope', 'TreeService', function($scope, TreeService) {
      var vm = this;
      vm.trees = TreeService.all();
      vm.remove = function(tree) {
        TreeService.remove(tree);
      };
    }]
  });
})();
