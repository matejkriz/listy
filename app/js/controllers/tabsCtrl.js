(function() {
  'use strict';
  define([], function() {
    return ['$ionicHistory', '$scope', function($ionicHistory, $scope) {
      var vm = this;
      vm.clearHistory = function() {
        $ionicHistory.clearHistory();
      }
    }];
  });
})();
