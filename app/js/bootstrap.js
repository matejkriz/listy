// Include libraries that should be included at "all times" and are dependencies
// to some other behaviors.
//
// Add some functionalities to specific parts of existing libraries
define([
  'ionic',
  'angular',
  'app',
  'jquery',
  'lodash',
  'restangular'
], function(
  ionic,
  angular,
  app,
  $,
  _
) {
  'use strict';
  angular.element(document).ready(function() {
    angular.bootstrap(document, ['listy']);
  });
});
