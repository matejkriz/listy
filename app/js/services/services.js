define(function(require) {
  'use strict';

  var angular = require('angular'),
    services = angular.module('listy.services', []);

  services.service('CameraService', require('services/CameraService'));
  services.service('TreeService', require('services/TreeService'));

  return services;

});
