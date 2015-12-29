// Include libraries that should be included at "all times" and are dependencies
// to some other behaviors.
//
// Add some functionalities to specific parts of existing libraries
define([
  'ionic',
  'angular',
  'app',
  'restangular'
], function(
  ionic,
  angular,
  app
) {
  'use strict';
  angular.element(document).ready(function() {
    angular.bootstrap(document, ['listy']);
  });
});
