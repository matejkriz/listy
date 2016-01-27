(function() {
  'use strict';
  define([], function() {
    return ['$scope', '$stateParams', 'TreeService', function($scope, $stateParams, TreeService) {
      var vm = this;
      $scope.$on('$ionicView.enter', function(e) {
        TreeService.get($stateParams.treeId)
          .then(function(tree) {
            vm.tree = tree;
          });
      });
    }];
  });
})();
