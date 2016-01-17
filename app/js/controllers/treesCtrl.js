(function() {
  'use strict';
  define([], function() {
    return ['API', '$scope', 'TreeService', function(API, $scope, TreeService) {
      var vm = this;
      vm.imgPath = API.images;
      vm.trees = TreeService.all();
      vm.remove = function(tree) {
        TreeService.remove(tree);
      };
    }]
  });
})();
