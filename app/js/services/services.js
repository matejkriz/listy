define(function(require) {
  'use strict';

  var angular = require('angular'),
    services = angular.module('listy.services', ['restangular']);

  services.service('CameraService', require('services/CameraService'));
  services.service('api', require('services/RestAPIService'));
  services.service('feat', require('services/JSFeatService'));
  services.service('TreeService', require('services/TreeService'));

  return services;

});
