(function() {
  'use strict';
  define(function(require) {

    var angular = require('angular'),
      directives = angular.module('listy.directives', []);

    directives.directive('ngFileSelect', require('directives/ngFileSelectDirective'));

    return directives;

  });
})();
