(function() {
  'use strict';
  define([], function() {
    return ['API', '$scope', 'TreeService', function(API, $scope, TreeService) {
      var vm = this;
      vm.imgPath = API.images;
      vm.remove = remove;
      vm.trees = TreeService.getList();

      TreeService.getList().then(function(treesList){
        vm.trees = treesList;
        return vm.trees;
      })

      function remove(tree) {
        TreeService.remove(tree);
      };
    }];
  });
})();
