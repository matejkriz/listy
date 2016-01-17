(function() {
  'use strict';
  define([
    'angular',

    'controllers/recognizeCtrl',
    'controllers/treesCtrl',
    'controllers/treeDetailCtrl'
  ], function(
    angular,
    recognizeCtrl,
    treesCtrl,
    treeDetailCtrl
  ) {
    var module = angular.module('listy.controllers', []);


    module.controller({
      recognizeCtrl: recognizeCtrl,
      treesCtrl: treesCtrl,
      treeDetailCtrl: treeDetailCtrl
    });
    // To listen for when any page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
  });
})();
