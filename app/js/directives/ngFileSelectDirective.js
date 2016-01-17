(function() {
  'use strict';
  define([], function() {
    var ngFileSelect = function() {
      return {
        link: function($scope, el) {
          el.bind("change", function(e) {
            $scope.vm.file = (e.srcElement || e.target).files[0];
            $scope.vm.getFile($scope.vm.file);
          });
        }
      };
    };

    return ngFileSelect;
  });
})();
