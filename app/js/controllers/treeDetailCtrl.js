(function() {
  'use strict';
  define([], function() {
    return ['$scope', '$stateParams', 'TreeService', function($scope, $stateParams, TreeService) {
      var vm = this;
      vm.tree = TreeService.get($stateParams.treeId);
    }];
  });
})();
