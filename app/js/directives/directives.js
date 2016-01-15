define(function(require) {
  'use strict';

  var angular = require('angular'),
    directives = angular.module('listy.directives', []);

    directives.directive('ngFileSelect', require('directives/ngFileSelectDirective'));

  return directives;

});
